import Foundation

// MARK: - Meme Plan JSON Schema
struct MemePlan: Codable {
    let template: String
    let topText: String
    let bottomText: String
    let badges: [Badge]
    let caption: String
    let progress: ProgressInfo
    let palette: ColorPalette
    
    enum CodingKeys: String, CodingKey {
        case template
        case topText = "top_text"
        case bottomText = "bottom_text"
        case badges
        case caption
        case progress
        case palette
    }
}

struct Badge: Codable {
    let text: String
    let color: String
    let position: BadgePosition
}

struct BadgePosition: Codable {
    let x: Double
    let y: Double
}

struct ProgressInfo: Codable {
    let percent: Double
    let label: String
}

struct ColorPalette: Codable {
    let primary: String
    let secondary: String
    let background: String
    let text: String
    let accent: String
}

// MARK: - Template Types
enum MemeTemplate: String, CaseIterable {
    case topBottom = "top_bottom"
    case progressCard = "progress_card"
    case motivational = "motivational"
    case achievement = "achievement"
    
    var displayName: String {
        switch self {
        case .topBottom: return "Top/Bottom Meme"
        case .progressCard: return "Progress Card"
        case .motivational: return "Motivational"
        case .achievement: return "Achievement"
        }
    }
}

// MARK: - Example Data
extension MemePlan {
    static let example = MemePlan(
        template: "top_bottom",
        topText: "🎯 Focus Session Complete!",
        bottomText: "You crushed it! 💪",
        badges: [
            Badge(text: "🔥", color: "#FF6B35", position: BadgePosition(x: 0.1, y: 0.1)),
            Badge(text: "⚡", color: "#F7931E", position: BadgePosition(x: 0.8, y: 0.1)),
            Badge(text: "📈", color: "#4ECDC4", position: BadgePosition(x: 0.1, y: 0.8))
        ],
        caption: "Based on your 5-minute work session",
        progress: ProgressInfo(percent: 85.0, label: "Productivity Score"),
        palette: ColorPalette(
            primary: "#667eea",
            secondary: "#764ba2", 
            background: "#ffffff",
            text: "#333333",
            accent: "#4ECDC4"
        )
    )
}
