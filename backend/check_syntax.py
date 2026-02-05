import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from backend import main
    print("✅ Backend syntax is correct. Import successful.")
except ImportError as e:
    # This might happen if requirements are missing, but we want to check for IndentationError
    print(f"⚠️ Import Error (might be deps): {e}")
except SyntaxError as e:
    print(f"❌ SYNTAX ERROR: {e}")
except IndentationError as e:
    print(f"❌ INDENTATION ERROR: {e}")
except Exception as e:
    print(f"❌ OTHER ERROR: {e}")
