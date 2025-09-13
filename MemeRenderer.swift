import Foundation
import CoreGraphics
import AppKit

// MARK: - Meme Renderer
class MemeRenderer {
    static let shared = MemeRenderer()
    
    private init() {}
    
    // MARK: - Main Rendering Function
    func renderMeme(from plan: MemePlan, size: CGSize = CGSize(width: 1200, height: 628)) -> NSImage? {
        let context = CGContext(
            data: nil,
            width: Int(size.width),
            height: Int(size.height),
            bitsPerComponent: 8,
            bytesPerRow: 0,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        )
        
        guard let ctx = context else { return nil }
        
        // Set background
        drawBackground(ctx: ctx, size: size, palette: plan.palette)
        
        // Render based on template
        switch MemeTemplate(rawValue: plan.template) {
        case .topBottom:
            renderTopBottomMeme(ctx: ctx, size: size, plan: plan)
        case .progressCard:
            renderProgressCard(ctx: ctx, size: size, plan: plan)
        case .motivational:
            renderMotivationalMeme(ctx: ctx, size: size, plan: plan)
        case .achievement:
            renderAchievementMeme(ctx: ctx, size: size, plan: plan)
        default:
            renderTopBottomMeme(ctx: ctx, size: size, plan: plan)
        }
        
        // Draw badges
        drawBadges(ctx: ctx, size: size, badges: plan.badges)
        
        // Draw caption
        drawCaption(ctx: ctx, size: size, caption: plan.caption, palette: plan.palette)
        
        guard let cgImage = ctx.makeImage() else { return nil }
        return NSImage(cgImage: cgImage, size: size)
    }
    
    // MARK: - Background
    private func drawBackground(ctx: CGContext, size: CGSize, palette: ColorPalette) {
        let backgroundColor = NSColor(hex: palette.background) ?? .white
        ctx.setFillColor(backgroundColor.cgColor)
        ctx.fill(CGRect(origin: .zero, size: size))
        
        // Add subtle gradient
        let gradient = CGGradient(
            colorsSpace: CGColorSpaceCreateDeviceRGB(),
            colors: [
                NSColor(hex: palette.primary)?.cgColor ?? NSColor.blue.cgColor,
                NSColor(hex: palette.secondary)?.cgColor ?? NSColor.purple.cgColor
            ] as CFArray,
            locations: [0.0, 1.0]
        )
        
        if let gradient = gradient {
            ctx.drawLinearGradient(
                gradient,
                start: CGPoint(x: 0, y: size.height),
                end: CGPoint(x: size.width, y: 0),
                options: []
            )
        }
    }
    
    // MARK: - Template Renderers
    private func renderTopBottomMeme(ctx: CGContext, size: CGSize, plan: MemePlan) {
        let textColor = NSColor(hex: plan.palette.text) ?? .black
        
        // Top text
        drawText(
            ctx: ctx,
            text: plan.topText,
            rect: CGRect(x: 50, y: size.height - 200, width: size.width - 100, height: 100),
            fontSize: 48,
            color: textColor,
            alignment: .center
        )
        
        // Bottom text
        drawText(
            ctx: ctx,
            text: plan.bottomText,
            rect: CGRect(x: 50, y: 50, width: size.width - 100, height: 100),
            fontSize: 36,
            color: textColor,
            alignment: .center
        )
    }
    
    private func renderProgressCard(ctx: CGContext, size: CGSize, plan: MemePlan) {
        let cardRect = CGRect(x: 100, y: 100, width: size.width - 200, height: size.height - 200)
        let cardColor = NSColor(hex: plan.palette.primary) ?? .blue
        
        // Card background
        ctx.setFillColor(cardColor.withAlphaComponent(0.1).cgColor)
        ctx.setStrokeColor(cardColor.cgColor)
        ctx.setLineWidth(4)
        ctx.fill(cardRect)
        ctx.stroke(cardRect)
        
        // Progress bar
        let progressRect = CGRect(x: cardRect.minX + 50, y: cardRect.midY - 20, width: cardRect.width - 100, height: 40)
        drawProgressBar(ctx: ctx, rect: progressRect, progress: plan.progress.percent, palette: plan.palette)
        
        // Progress label
        drawText(
            ctx: ctx,
            text: plan.progress.label,
            rect: CGRect(x: cardRect.minX + 50, y: cardRect.midY + 30, width: cardRect.width - 100, height: 40),
            fontSize: 24,
            color: NSColor(hex: plan.palette.text) ?? .black,
            alignment: .center
        )
        
        // Main text
        drawText(
            ctx: ctx,
            text: plan.topText,
            rect: CGRect(x: cardRect.minX + 50, y: cardRect.maxY - 100, width: cardRect.width - 100, height: 50),
            fontSize: 32,
            color: NSColor(hex: plan.palette.text) ?? .black,
            alignment: .center
        )
    }
    
    private func renderMotivationalMeme(ctx: CGContext, size: CGSize, plan: MemePlan) {
        let centerY = size.height / 2
        
        // Main motivational text
        drawText(
            ctx: ctx,
            text: plan.topText,
            rect: CGRect(x: 50, y: centerY - 50, width: size.width - 100, height: 100),
            fontSize: 42,
            color: NSColor(hex: plan.palette.text) ?? .black,
            alignment: .center
        )
        
        // Subtitle
        drawText(
            ctx: ctx,
            text: plan.bottomText,
            rect: CGRect(x: 50, y: centerY + 60, width: size.width - 100, height: 60),
            fontSize: 28,
            color: NSColor(hex: plan.palette.accent) ?? .green,
            alignment: .center
        )
    }
    
    private func renderAchievementMeme(ctx: CGContext, size: CGSize, plan: MemePlan) {
        // Achievement badge background
        let badgeSize: CGFloat = 200
        let badgeRect = CGRect(
            x: (size.width - badgeSize) / 2,
            y: (size.height - badgeSize) / 2 - 50,
            width: badgeSize,
            height: badgeSize
        )
        
        let badgeColor = NSColor(hex: plan.palette.accent) ?? .green
        ctx.setFillColor(badgeColor.withAlphaComponent(0.2).cgColor)
        ctx.setStrokeColor(badgeColor.cgColor)
        ctx.setLineWidth(6)
        ctx.fillEllipse(in: badgeRect)
        ctx.strokeEllipse(in: badgeRect)
        
        // Achievement text
        drawText(
            ctx: ctx,
            text: plan.topText,
            rect: CGRect(x: 50, y: badgeRect.maxY + 20, width: size.width - 100, height: 80),
            fontSize: 36,
            color: NSColor(hex: plan.palette.text) ?? .black,
            alignment: .center
        )
        
        // Bottom text
        drawText(
            ctx: ctx,
            text: plan.bottomText,
            rect: CGRect(x: 50, y: 50, width: size.width - 100, height: 60),
            fontSize: 24,
            color: NSColor(hex: plan.palette.accent) ?? .green,
            alignment: .center
        )
    }
    
    // MARK: - Helper Functions
    private func drawText(ctx: CGContext, text: String, rect: CGRect, fontSize: CGFloat, color: NSColor, alignment: NSTextAlignment) {
        let font = NSFont.boldSystemFont(ofSize: fontSize)
        let attributes: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: color,
            .strokeColor: NSColor.white,
            .strokeWidth: -2.0
        ]
        
        let attributedString = NSAttributedString(string: text, attributes: attributes)
        let textSize = attributedString.size()
        
        var drawRect = rect
        switch alignment {
        case .center:
            drawRect.origin.x = rect.midX - textSize.width / 2
            drawRect.origin.y = rect.midY - textSize.height / 2
        case .left:
            drawRect.origin.x = rect.minX
            drawRect.origin.y = rect.midY - textSize.height / 2
        case .right:
            drawRect.origin.x = rect.maxX - textSize.width
            drawRect.origin.y = rect.midY - textSize.height / 2
        default:
            break
        }
        
        drawRect.size = textSize
        attributedString.draw(in: drawRect)
    }
    
    private func drawProgressBar(ctx: CGContext, rect: CGRect, progress: Double, palette: ColorPalette) {
        // Background
        ctx.setFillColor(NSColor.lightGray.withAlphaComponent(0.3).cgColor)
        ctx.fill(rect)
        
        // Progress fill
        let progressWidth = rect.width * CGFloat(progress / 100.0)
        let progressRect = CGRect(x: rect.minX, y: rect.minY, width: progressWidth, height: rect.height)
        
        let progressColor = NSColor(hex: palette.accent) ?? .green
        ctx.setFillColor(progressColor.cgColor)
        ctx.fill(progressRect)
        
        // Border
        ctx.setStrokeColor(NSColor(hex: palette.text)?.cgColor ?? NSColor.black.cgColor)
        ctx.setLineWidth(2)
        ctx.stroke(rect)
        
        // Progress percentage text
        let percentText = "\(Int(progress))%"
        drawText(
            ctx: ctx,
            text: percentText,
            rect: rect,
            fontSize: 20,
            color: NSColor(hex: palette.text) ?? .black,
            alignment: .center
        )
    }
    
    private func drawBadges(ctx: CGContext, size: CGSize, badges: [Badge]) {
        for badge in badges {
            let badgeSize: CGFloat = 60
            let badgeRect = CGRect(
                x: size.width * badge.position.x - badgeSize / 2,
                y: size.height * badge.position.y - badgeSize / 2,
                width: badgeSize,
                height: badgeSize
            )
            
            // Badge background
            let badgeColor = NSColor(hex: badge.color) ?? .blue
            ctx.setFillColor(badgeColor.withAlphaComponent(0.8).cgColor)
            ctx.fillEllipse(in: badgeRect)
            
            // Badge text
            drawText(
                ctx: ctx,
                text: badge.text,
                rect: badgeRect,
                fontSize: 24,
                color: .white,
                alignment: .center
            )
        }
    }
    
    private func drawCaption(ctx: CGContext, size: CGSize, caption: String, palette: ColorPalette) {
        drawText(
            ctx: ctx,
            text: caption,
            rect: CGRect(x: 20, y: 20, width: size.width - 40, height: 40),
            fontSize: 16,
            color: NSColor(hex: palette.text)?.withAlphaComponent(0.7) ?? .gray,
            alignment: .left
        )
    }
}

// MARK: - NSColor Extension
extension NSColor {
    convenience init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            return nil
        }
        
        self.init(
            red: CGFloat(r) / 255,
            green: CGFloat(g) / 255,
            blue: CGFloat(b) / 255,
            alpha: CGFloat(a) / 255
        )
    }
}
