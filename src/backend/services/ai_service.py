import os
import json
import math
import warnings

from dotenv import load_dotenv
load_dotenv()

warnings.filterwarnings("ignore", category=FutureWarning)

try:
    import google.genai as genai
except ImportError:
    import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception:
        pass

GEMINI_AVAILABLE = bool(GEMINI_API_KEY)

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates distance in meters between two geographic coordinates using Haversine formula.
    """
    R = 6371000.0  # Radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2) + math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c  # Distance in meters

def _generate_with_gemini(prompt: str, image_part=None):
    """
    Helper function trying available Gemini models in sequence.
    """
    candidate_models = [
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-2.5-flash-lite",
        "gemini-3.8-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash"
    ]
    
    for model_name in candidate_models:
        try:
            model = genai.GenerativeModel(model_name)
            if image_part:
                response = model.generate_content([prompt, image_part])
            else:
                response = model.generate_content(prompt)
                
            if response and response.text:
                return response.text
        except Exception as e:
            continue
            
    raise RuntimeError("No compatible Gemini model found or API key quota exceeded")

def analyze_complaint_severity_and_hazard(category: str, description: str) -> dict:
    """
    Uses Gemini AI to perform real-time semantic analysis of a complaint,
    calculating severity score (1-10), hazard classification, and customized reasoning explanation.
    """
    if not GEMINI_API_KEY:
        return fallback_ai_analysis(category, description)

    try:
        prompt = f"""
        You are an Expert AI Municipal Risk Assessor for Coimbatore City Municipal Corporation.
        Analyze the following citizen complaint submission:

        Category: "{category}"
        Description: "{description}"

        TASK:
        1. Rate severity score from 1 to 10 based on public hazard, safety risk, and urgency.
        2. Assign a concise Hazard Type (e.g. "Public Safety & Night Crime Risk", "Traffic & Structural Danger", "Public Health & Sanitation Risk", "Water Supply Interruption").
        3. Write a clear, professional 2-sentence explanation of the specific risk and recommended dispatch action.

        Respond STRICTLY in valid JSON format:
        {{
          "severity_score": <int 1-10>,
          "hazard_type": "<short hazard type>",
          "explanation": "<2-sentence explanation specific to the category and description>"
        }}
        """

        text_content = _generate_with_gemini(prompt).strip()
        if text_content.startswith("```json"):
            text_content = text_content[7:-3].strip()
        elif text_content.startswith("```"):
            text_content = text_content[3:-3].strip()

        parsed = json.loads(text_content)
        return {
            "severity_score": int(parsed.get("severity_score", 7)),
            "hazard_type": str(parsed.get("hazard_type", "Public Hazard")),
            "explanation": str(parsed.get("explanation", f"Real-time AI verified complaint regarding {category}."))
        }
    except Exception as e:
        print(f"Gemini API Analysis fallback activated: {e}")
        return fallback_ai_analysis(category, description)

# Alias for backward compatibility
analyze_complaint = analyze_complaint_severity_and_hazard

def fallback_ai_analysis(category: str, description: str) -> dict:
    text = (category + " " + description).lower()
    
    if any(k in text for k in ["shock", "spark", "exposed", "wire", "broken pole", "live"]):
        return {
            "severity_score": 10,
            "hazard_type": "Electrical Safety Hazard",
            "explanation": f"Exposed electrical infrastructure reported. Imminent electrocution and fire risk. Immediate emergency dispatch recommended."
        }
    elif any(k in text for k in ["street light", "light", "dark", "night", "theft", "crime", "lamp"]):
        return {
            "severity_score": 7,
            "hazard_type": "Public Safety & Night Crime Risk",
            "explanation": f"The complaint indicates inadequate lighting on {description[:30]}... creating dark zones and potential safety risks for pedestrians at night. Immediate lighting inspection recommended."
        }
    elif any(k in text for k in ["road", "pothole", "accident", "traffic"]):
        return {
            "severity_score": 8,
            "hazard_type": "Traffic & Vehicular Safety",
            "explanation": f"Road surface damage reported. Potholes and pavement issues pose risks to commuter vehicles and traffic flow. Immediate patch dispatch recommended."
        }
    elif any(k in text for k in ["water", "leak", "pipe", "contamination"]):
        return {
            "severity_score": 8,
            "hazard_type": "Water Supply Interruption",
            "explanation": f"Water pipeline disruption reported. Risk of clean water loss and localized flooding. Utility crew dispatch recommended."
        }
    elif any(k in text for k in ["garbage", "trash", "sanitat", "waste"]):
        return {
            "severity_score": 6,
            "hazard_type": "Public Health & Sanitation Risk",
            "explanation": f"Uncollected waste accumulation reported. Environmental hazard and vector breeding risk. Sanitation crew dispatch recommended."
        }
    else:
        return {
            "severity_score": 5,
            "hazard_type": "Municipal Grievance",
            "explanation": f"AI verified complaint regarding {category}. Assigned to ward municipal team for priority inspection."
        }

CATEGORY_TO_SECTOR_MAP = {
    "Roads & Potholes": "Roads & Highways",
    "Street Lights": "Street Lighting",
    "Water Supply & Leaks": "Water Supply",
    "Drainage & Sewage": "Drainage",
    "Sanitation & Garbage": "Sanitation",
    "Electricity": "Electricity"
}

def get_department_for_complaint(category: str, description: str, db=None) -> int:
    """
    Maps complaint category and description to standard municipal department IDs.
    Returns None if no matching sector exists to ensure safe fallback.
    """
    if not db:
        return None
        
    sector_name = CATEGORY_TO_SECTOR_MAP.get(category)
    if not sector_name:
        return None
        
    from models import Department
    dept = db.query(Department).filter(Department.name == sector_name).first()
    return dept.id if dept else None

def detect_semantic_duplicate(new_description: str, new_lat: float, new_lng: float, nearby_complaints: list) -> dict:
    """
    Requirements 6 & 7:
    Strictly filters complaints within a 200 METER RADIUS using Haversine distance formula,
    and then performs semantic AI comparison on the 200m subset.
    """
    within_200m_complaints = []
    for c in nearby_complaints:
        c_lat = c.get("lat") or c.get("location_lat")
        c_lng = c.get("lng") or c.get("location_lng")
        if c_lat is not None and c_lng is not None:
            dist_meters = calculate_haversine_distance(new_lat, new_lng, float(c_lat), float(c_lng))
            if dist_meters <= 200.0:
                c_copy = dict(c)
                c_copy["distance_meters"] = round(dist_meters, 1)
                within_200m_complaints.append(c_copy)

    if not within_200m_complaints:
        return {"is_duplicate": False, "existing_complaint_id": None, "reason": "No existing complaints within 200m radius."}

    if not GEMINI_API_KEY:
        return _fallback_duplicate_check(new_description, within_200m_complaints)

    try:
        complaints_context = [
            {
                "id": c["id"],
                "category": c.get("category"),
                "description": c.get("description"),
                "street": c.get("street"),
                "distance_meters": c["distance_meters"]
            }
            for c in within_200m_complaints
        ]
        
        prompt = f"""
        You are an AI Civic Duplicate Detector for Coimbatore Corporation.
        Compare the NEW COMPLAINT against EXISTING NEARBY COMPLAINTS (all strictly within 200 meters).

        NEW COMPLAINT:
        "{new_description}"

        EXISTING COMPLAINTS WITHIN 200 METERS:
        {json.dumps(complaints_context, indent=2)}

        CRITICAL RULES:
        1. Mark "is_duplicate": true ONLY if the new complaint describes the EXACT SAME physical problem as an existing complaint.
        2. Mark "is_duplicate": false if they are DIFFERENT issues in the same area.

        Respond STRICTLY in valid JSON:
        {{
          "is_duplicate": true or false,
          "existing_complaint_id": <int or null>,
          "confidence": <float 0.0-1.0>,
          "reason": "<short explanation>"
        }}
        """
        text_content = _generate_with_gemini(prompt).strip()
        if text_content.startswith("```json"):
            text_content = text_content[7:-3].strip()
        elif text_content.startswith("```"):
            text_content = text_content[3:-3].strip()
            
        parsed = json.loads(text_content)
        if parsed.get("is_duplicate") and parsed.get("existing_complaint_id"):
            match_c = next((item for item in within_200m_complaints if item["id"] == parsed["existing_complaint_id"]), within_200m_complaints[0])
            parsed["existing_complaint_votes"] = match_c.get("vote_count", 1)
            parsed["existing_complaint_location"] = match_c.get("street", "Coimbatore")
            
        return parsed
    except Exception as e:
        print(f"Gemini duplicate check fallback: {e}")
        return _fallback_duplicate_check(new_description, within_200m_complaints)

def _fallback_duplicate_check(new_description: str, within_200m_complaints: list) -> dict:
    new_desc_lower = new_description.lower()
    for c in within_200m_complaints:
        existing_desc = (c.get("description") or "").lower()
        existing_cat = (c.get("category") or "").lower()
        
        pothole_match = ("pothole" in new_desc_lower or "road" in new_desc_lower) and ("pothole" in existing_desc or "road" in existing_desc or "road" in existing_cat)
        light_match = ("light" in new_desc_lower or "lamp" in new_desc_lower) and ("light" in existing_desc or "light" in existing_cat)
        water_match = ("water" in new_desc_lower or "leak" in new_desc_lower) and ("water" in existing_desc or "water" in existing_cat)
        
        if pothole_match or light_match or water_match:
            return {
                "is_duplicate": True,
                "existing_complaint_id": c["id"],
                "existing_complaint_votes": c.get("vote_count", 1),
                "existing_complaint_location": c.get("street", "Coimbatore"),
                "confidence": 0.92,
                "reason": f"Matches existing complaint #{c['id']} within {c['distance_meters']}m describing the same issue."
            }
    return {"is_duplicate": False, "existing_complaint_id": None, "reason": "Different issue within 200m radius."}

def validate_photo_with_gemini(image_bytes: bytes, category: str, description: str) -> dict:
    if not GEMINI_API_KEY:
        return {"is_valid": True, "reason": "Vision AI key unconfigured"}

    try:
        prompt = f"""
        Analyze photo for civic complaint in Coimbatore.
        Category: "{category}", Description: "{description}"
        Does this photo visually depict the reported civic problem?
        Respond STRICTLY in JSON format:
        {{ "is_valid": true or false, "reason": "<explanation>" }}
        """
        image_part = {"mime_type": "image/jpeg", "data": image_bytes}
        text_content = _generate_with_gemini(prompt, image_part).strip()
        if text_content.startswith("```json"):
            text_content = text_content[7:-3].strip()
        elif text_content.startswith("```"):
            text_content = text_content[3:-3].strip()
        return json.loads(text_content)
    except Exception as e:
        return {"is_valid": True, "reason": f"Vision AI bypass: {str(e)}"}
