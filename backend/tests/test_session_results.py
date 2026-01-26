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
        print(response.json())
        assert len(response.json()) == 23
        assert response.json()[7] == {'round': 7, 'name': 'Spanish Grand Prix'}
        assert response.json()[20] == {'round': 20, 'name': 'São Paulo Grand Prix'}

    def test_invalid_early_year(self):
        response = client.get(f"/api/session_results/{settings.EARLIEST_YEAR - 1}")
        assert response.status_code == 400
        assert response.json() == {"detail": f"Selected year must be between {settings.EARLIEST_YEAR} and {settings.LATEST_YEAR} inclusive"}
    
    def test_invalid_early_year(self):
        response = client.get(f"/api/session_results/{settings.LATEST_YEAR + 1}")
        assert response.status_code == 400
        assert response.json() == {"detail": f"Selected year must be between {settings.EARLIEST_YEAR} and {settings.LATEST_YEAR} inclusive"}
