from fastapi.testclient import TestClient
from backend.main import app
from backend.config import settings

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200

class Test_Get_Schedule:
    def test_valid_year(self):
        response = client.get("/api/session_results/2023")
        assert response.status_code == 200
        assert len(response.json()) == 22
        assert response.json()[6] == {'round': 7, 'name': 'Spanish'}
        assert response.json()[19] == {'round': 20, 'name': 'São Paulo'}

    def test_invalid_early_year(self):
        response = client.get(f"/api/session_results/{settings.EARLIEST_YEAR - 1}")
        assert response.status_code == 400
        assert response.json() == {"detail": f"Selected year must be between {settings.EARLIEST_YEAR} and {settings.LATEST_YEAR} inclusive"}
    
    def test_invalid_early_year(self):
        response = client.get(f"/api/session_results/{settings.LATEST_YEAR + 1}")
        assert response.status_code == 400
        assert response.json() == {"detail": f"Selected year must be between {settings.EARLIEST_YEAR} and {settings.LATEST_YEAR} inclusive"}

class Test_Get_Session_Results:
    def test_valid_race(self):
        # Get results for Spansih GP (round 7)
        response = client.get("/api/session_results/2023/7")
        assert response.status_code == 200
        assert len(response.json()) == 20
        assert response.json()[0] == {'Driver': 'VER', 'LapTime': '1:12.272', 'LapTimeDelta': 0.0}
        assert response.json()[19] == {'Driver': 'SAR', 'LapTime': '1:14.698', 'LapTimeDelta': 2.427}
