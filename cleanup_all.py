import os

files_to_delete = [
    r"d:\projects\civic-pulse\DEPLOYMENT_GUIDE.md",
    r"d:\projects\civic-pulse\POSTGRES_SETUP.md",
    r"d:\projects\civic-pulse\API_KEYS_GUIDE.md",
    r"d:\projects\civic-pulse\HOW_TO_RUN.md",
    r"d:\projects\civic-pulse\MILESTONES.md",
    r"d:\projects\civic-pulse\src\DEPLOYMENT_GUIDE.md",
    r"d:\projects\civic-pulse\src\POSTGRES_SETUP.md",
    r"d:\projects\civic-pulse\src\API_KEYS_GUIDE.md",
    r"d:\projects\civic-pulse\src\HOW_TO_RUN.md",
    r"d:\projects\civic-pulse\src\clean_up.py"
]

for filepath in files_to_delete:
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
            print(f"Deleted: {filepath}")
        except Exception as e:
            print(f"Error deleting {filepath}: {e}")
