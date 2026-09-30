import os

files = [
    r"d:\projects\civic-pulse\src\API_KEYS_GUIDE.md",
    r"d:\projects\civic-pulse\src\HOW_TO_RUN.md",
    r"d:\projects\civic-pulse\src\POSTGRES_SETUP.md",
    r"d:\projects\civic-pulse\src\README.md"
]

for f in files:
    if os.path.exists(f):
        try:
            os.remove(f)
            print(f"Removed {f}")
        except Exception:
            pass
