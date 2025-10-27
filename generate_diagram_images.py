#!/usr/bin/env python3
"""
DevConnect Diagram Image Generator
Generates PNG images from Mermaid diagrams using mermaid-cli
"""

import os
import subprocess
import sys
from pathlib import Path

def check_mermaid_cli():
    """Check if mermaid-cli is installed"""
    try:
        result = subprocess.run(['mmdc', '--version'], 
                              capture_output=True, text=True, check=True)
        print(f"✅ Mermaid CLI found: {result.stdout.strip()}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Mermaid CLI not found. Installing...")
        try:
            subprocess.run(['npm', 'install', '-g', '@mermaid-js/mermaid-cli'], 
                         check=True)
            print("✅ Mermaid CLI installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install Mermaid CLI")
            return False

def generate_images():
    """Generate PNG images from Mermaid diagram files"""
    
    # Create images directory
    images_dir = Path("images")
    images_dir.mkdir(exist_ok=True)
    
    # List of diagram files
    diagrams = [
        ("diagrams/user_registration_workflow.mmd", "user_registration_workflow.png"),
        ("diagrams/feed_discovery_workflow.mmd", "feed_discovery_workflow.png"),
        ("diagrams/connection_request_workflow.mmd", "connection_request_workflow.png"),
        ("diagrams/realtime_chat_workflow.mmd", "realtime_chat_workflow.png"),
        ("diagrams/system_architecture_hld.mmd", "system_architecture_hld.png"),
        ("diagrams/database_schema_lld.mmd", "database_schema_lld.png"),
        ("diagrams/ml_recommendation_engine.mmd", "ml_recommendation_engine.png"),
        ("diagrams/payment_workflow.mmd", "payment_workflow.png"),
        ("diagrams/authentication_flow.mmd", "authentication_flow.png")
    ]
    
    print("🚀 Generating DevConnect Diagram Images...")
    print("=" * 50)
    
    success_count = 0
    
    for input_file, output_file in diagrams:
        input_path = Path(input_file)
        output_path = images_dir / output_file
        
        if not input_path.exists():
            print(f"❌ Input file not found: {input_file}")
            continue
            
        try:
            print(f"📊 Processing: {input_file}")
            
            # Generate PNG using mermaid-cli
            cmd = [
                'mmdc',
                '-i', str(input_path),
                '-o', str(output_path),
                '-t', 'default',
                '-w', '1200',
                '-H', '800',
                '--backgroundColor', 'white'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            if output_path.exists():
                print(f"✅ Generated: {output_file}")
                success_count += 1
            else:
                print(f"❌ Failed to generate: {output_file}")
                
        except subprocess.CalledProcessError as e:
            print(f"❌ Error processing {input_file}: {e.stderr}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
    
    print("=" * 50)
    print(f"🎉 Successfully generated {success_count}/{len(diagrams)} images")
    
    if success_count > 0:
        print(f"📁 Images saved in: {images_dir.absolute()}")
        
        # List generated files
        print("\n📋 Generated Files:")
        for img_file in sorted(images_dir.glob("*.png")):
            size = img_file.stat().st_size
            print(f"   • {img_file.name} ({size:,} bytes)")

def create_diagram_index():
    """Create an index HTML file for the generated images"""
    
    images_dir = Path("images")
    if not images_dir.exists():
        return
        
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevConnect - Generated Diagram Images</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 40px;
        }
        .diagram-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        .diagram-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            background: #fafafa;
        }
        .diagram-title {
            background: #3498db;
            color: white;
            padding: 15px;
            font-weight: bold;
            text-align: center;
        }
        .diagram-image {
            width: 100%;
            height: auto;
            display: block;
        }
        .diagram-description {
            padding: 15px;
            background: #ecf0f1;
            font-style: italic;
            color: #7f8c8d;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 DevConnect - System Design Diagram Images</h1>
        <p style="text-align: center; color: #7f8c8d; font-size: 1.1em;">
            Generated PNG images from Mermaid diagrams for DevConnect project
        </p>
        
        <div class="diagram-grid">
"""
    
    # Add diagram items
    diagram_info = {
        "user_registration_workflow.png": "Complete user registration flow including validation, password hashing, JWT token generation, and welcome email notification.",
        "feed_discovery_workflow.png": "AI-powered feed discovery using multiple similarity algorithms (Jaccard, Cosine, Complementary skills) with fallback to random recommendations.",
        "connection_request_workflow.png": "Connection request management workflow including sending requests, email notifications, and accept/reject functionality.",
        "realtime_chat_workflow.png": "Real-time messaging system with Socket.IO, message persistence, and user presence tracking.",
        "system_architecture_hld.png": "Complete system architecture showing client layer, CDN, frontend application, backend services, data layer, and external integrations.",
        "database_schema_lld.png": "Complete database schema showing User, Message, ConnectionRequest, and Payment entities with their relationships and fields.",
        "ml_recommendation_engine.png": "ML recommendation engine architecture showing input processing, feature extraction, similarity algorithms, scoring, and output generation.",
        "payment_workflow.png": "Complete payment integration workflow with PhonePe, including payment creation, verification, and premium activation.",
        "authentication_flow.png": "Complete authentication and authorization flow including JWT token management, middleware protection, and Socket.IO authentication."
    }
    
    for img_file in sorted(images_dir.glob("*.png")):
        filename = img_file.name
        title = filename.replace('.png', '').replace('_', ' ').title()
        description = diagram_info.get(filename, "System design diagram for DevConnect platform.")
        
        html_content += f"""
            <div class="diagram-item">
                <div class="diagram-title">{title}</div>
                <img src="{filename}" alt="{title}" class="diagram-image">
                <div class="diagram-description">{description}</div>
            </div>
"""
    
    html_content += """
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding: 20px; background: #ecf0f1; border-radius: 8px;">
            <h3 style="color: #2c3e50; margin-bottom: 10px;">📊 DevConnect System Design Summary</h3>
            <p style="color: #7f8c8d; font-size: 1.1em;">
                A comprehensive full-stack developer networking platform featuring AI-powered recommendations, 
                real-time messaging, premium subscriptions, and modern architecture patterns.
            </p>
        </div>
    </div>
</body>
</html>
"""
    
    index_file = images_dir / "index.html"
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"📄 Created index file: {index_file}")

if __name__ == "__main__":
    print("🎨 DevConnect Diagram Image Generator")
    print("=" * 40)
    
    # Check if mermaid-cli is available
    if not check_mermaid_cli():
        print("❌ Cannot proceed without Mermaid CLI")
        sys.exit(1)
    
    # Generate images
    generate_images()
    
    # Create index file
    create_diagram_index()
    
    print("\n🎉 All done! Check the 'images' folder for your generated diagrams.")


