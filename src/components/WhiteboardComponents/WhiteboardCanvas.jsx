import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'

export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 675
const BG_COLOR = '#FFFFFF'

const SHAPE_TOOLS = new Set(['LINE', 'RECTANGLE', 'CIRCLE', 'ARROW'])

const fillBackground = (ctx) => {
	ctx.save()
	ctx.globalCompositeOperation = 'source-over'
	ctx.fillStyle = BG_COLOR
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
	ctx.restore()
}

const applyStrokeStyle = (ctx, stroke) => {
	const strokeColor = stroke.toolType === 'ERASER' ? BG_COLOR : stroke.color || '#14161F'
	ctx.lineJoin = 'round'
	ctx.lineCap = 'round'
	ctx.lineWidth = stroke.strokeWidth || 4
	ctx.strokeStyle = strokeColor
	ctx.fillStyle = strokeColor
	return strokeColor
}

const drawFreehand = (ctx, stroke) => {
	const points = stroke.points || []
	if (!points.length) return
	applyStrokeStyle(ctx, stroke)

	if (points.length === 1) {
		ctx.beginPath()
		ctx.arc(points[0].x, points[0].y, (stroke.strokeWidth || 4) / 2, 0, Math.PI * 2)
		ctx.fill()
		return
	}

	ctx.beginPath()
	ctx.moveTo(points[0].x, points[0].y)
	for (let i = 1; i < points.length; i += 1) {
		ctx.lineTo(points[i].x, points[i].y)
	}
	ctx.stroke()
}

const drawLine = (ctx, stroke) => {
	applyStrokeStyle(ctx, stroke)
	ctx.beginPath()
	ctx.moveTo(stroke.startX, stroke.startY)
	ctx.lineTo(stroke.endX, stroke.endY)
	ctx.stroke()
}

const drawArrow = (ctx, stroke) => {
	const strokeColor = applyStrokeStyle(ctx, stroke)
	const { startX, startY, endX, endY } = stroke

	ctx.beginPath()
	ctx.moveTo(startX, startY)
	ctx.lineTo(endX, endY)
	ctx.stroke()

	const angle = Math.atan2(endY - startY, endX - startX)
	const headLength = Math.max(10, (stroke.strokeWidth || 4) * 3)

	ctx.beginPath()
	ctx.moveTo(endX, endY)
	ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6))
	ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6))
	ctx.closePath()
	ctx.fillStyle = strokeColor
	ctx.fill()
}

const drawRectangle = (ctx, stroke) => {
	applyStrokeStyle(ctx, stroke)
	ctx.strokeRect(stroke.x, stroke.y, stroke.width, stroke.height)
}

const drawCircle = (ctx, stroke) => {
	applyStrokeStyle(ctx, stroke)
	ctx.beginPath()
	ctx.arc(stroke.centerX, stroke.centerY, Math.max(stroke.radius, 0.01), 0, Math.PI * 2)
	ctx.stroke()
}

export const drawStroke = (ctx, stroke) => {
	switch (stroke.toolType) {
		case 'LINE':
			return drawLine(ctx, stroke)
		case 'ARROW':
			return drawArrow(ctx, stroke)
		case 'RECTANGLE':
			return drawRectangle(ctx, stroke)
		case 'CIRCLE':
			return drawCircle(ctx, stroke)
		default:
			return drawFreehand(ctx, stroke)
	}
}

const rectFromPoints = (start, end) => {
	return {
		x: Math.min(start.x, end.x),
		y: Math.min(start.y, end.y),
		width: Math.abs(end.x - start.x),
		height: Math.abs(end.y - start.y),
	}
}

const circleFromPoints = (start, end) => {
	return { centerX: start.x, centerY: start.y, radius: Math.hypot(end.x - start.x, end.y - start.y) }
}

const buildShapeStroke = (toolType, start, end, color, strokeWidth) => {
	const base = { toolType, color, strokeWidth }
	if (toolType === 'RECTANGLE') return { ...base, ...rectFromPoints(start, end) }
	if (toolType === 'CIRCLE') return { ...base, ...circleFromPoints(start, end) }
	return { ...base, startX: start.x, startY: start.y, endX: end.x, endY: end.y }
}

export const WhiteboardCanvas = forwardRef(function WhiteboardCanvas(
	{ strokes = [], color, brushSize, tool, onStrokeComplete, disabled },
	ref
) {
	const canvasRef = useRef(null)
	const drawingRef = useRef(false)
	const startPointRef = useRef(null)
	const lastPointRef = useRef(null)
	const currentPointsRef = useRef([])

	const redrawBase = useCallback(() => {
	const canvas = canvasRef.current
	if (!canvas) return null

	const ctx = canvas.getContext('2d')
        fillBackground(ctx)
        strokes.forEach((stroke) => drawStroke(ctx, stroke))
        return ctx
    }, [strokes])

	useEffect(() => {
        if (!drawingRef.current) {
            redrawBase()
        }
    }, [redrawBase])

	useImperativeHandle(
        ref,
        () => ({
            redraw: redrawBase,
        }),
        [redrawBase]
    )

	const getPoint = (event) => {
		const canvas = canvasRef.current
		const rect = canvas.getBoundingClientRect()
		const scaleX = CANVAS_WIDTH / rect.width
		const scaleY = CANVAS_HEIGHT / rect.height
		const clientX = event.touches ? event.touches[0].clientX : event.clientX
		const clientY = event.touches ? event.touches[0].clientY : event.clientY
		return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
	}

	const isShapeTool = () => SHAPE_TOOLS.has(tool.toUpperCase())

	const handlePointerDown = (event) => {
		if (disabled) return
		event.preventDefault()
		drawingRef.current = true
		const point = getPoint(event)
		startPointRef.current = point
		lastPointRef.current = point
		currentPointsRef.current = [point]

		if (!isShapeTool()) {
			drawStroke(canvasRef.current.getContext('2d'), {
				points: [point],
				color,
				strokeWidth: brushSize,
				toolType: tool.toUpperCase(),
			})
		}
	}

	const handlePointerMove = (event) => {
		if (!drawingRef.current || disabled) return
		event.preventDefault()
		const point = getPoint(event)

		if (isShapeTool()) {
			const ctx = redrawBase()
			drawStroke(ctx, buildShapeStroke(tool.toUpperCase(), startPointRef.current, point, color, brushSize))
		} else {
			const ctx = canvasRef.current.getContext('2d')
			drawStroke(ctx, {
				points: [lastPointRef.current, point],
				color,
				strokeWidth: brushSize,
				toolType: tool.toUpperCase(),
			})
			currentPointsRef.current.push(point)
		}
		lastPointRef.current = point
	}

	const handlePointerUp = () => {
		if (!drawingRef.current) return
		drawingRef.current = false

		if (isShapeTool()) {
			const start = startPointRef.current
			const end = lastPointRef.current
			const hasSize = start && end && (start.x !== end.x || start.y !== end.y)
			if (hasSize) {
				onStrokeComplete?.(buildShapeStroke(tool.toUpperCase(), start, end, color, brushSize))
			} else {
				redrawBase()
			}
			return
		}

		const points = currentPointsRef.current
		currentPointsRef.current = []
		if (points.length) {
			onStrokeComplete?.({ points, color, strokeWidth: brushSize, toolType: tool.toUpperCase() })
		}
	}

	return (
		<canvas
			ref={canvasRef}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			className={`w-full touch-none rounded-lg bg-white ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-crosshair'}`}
			onMouseDown={handlePointerDown}
			onMouseMove={handlePointerMove}
			onMouseUp={handlePointerUp}
			onMouseLeave={handlePointerUp}
			onTouchStart={handlePointerDown}
			onTouchMove={handlePointerMove}
			onTouchEnd={handlePointerUp}
		/>
	)
})
