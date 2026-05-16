.PHONY: all install run-ai run-backend run-frontend run-all clean db-update help

# Variables
PYTHON_VENV = ai-service/venv
PYTHON_BIN = $(PYTHON_VENV)/Scripts/python
AI_SERVICE_DIR = ai-service/app
BACKEND_DIR = backend/CareBase.API
FRONTEND_DIR = frontend

help:
	@echo "========================================================================"
	@echo "CAREBASE PROJECT MANAGEMENT"
	@echo "========================================================================"
	@echo "  Setup & Database:"
	@echo "    make install          - Setup virtual environments, restore packages, and install tools"
	@echo "    make setup-tools      - Install/Update global .NET tools (dotnet-ef)"
	@echo "    make db-update        - Apply database migrations via EF Core"
	@echo ""
	@echo "  Run Services:"
	@echo "    make run-ai           - Start Python AI Service"
	@echo "    make run-backend      - Start .NET Backend API"
	@echo "    make run-frontend     - Start React Frontend"
	@echo ""
	@echo "  Development (Watch Mode):"
	@echo "    make watch-backend    - Start Backend with 'dotnet watch'"
	@echo ""
	@echo "  Global Commands:"
	@echo "    make run-all          - Start all services concurrently"
	@echo "    make stop-all         - Stop all running dotnet/python/node processes"
	@echo "    make clean            - Remove build artifacts and temporary files"
	@echo "========================================================================"

install: setup-tools
	@echo ">>> Setting up Python virtual environment (if ai-service exists)..."
	@if [ -d ai-service ]; then \
		cd ai-service && python -m venv venv && \
		$(PYTHON_BIN) -m pip install --upgrade pip && \
		$(PYTHON_BIN) -m pip install -r requirements.txt; \
	else \
		echo "!!! ai-service directory not found, skipping Python setup !!!"; \
	fi
	@echo ">>> Restoring .NET Backend packages..."
	dotnet restore backend/CareBase.sln
	@echo ">>> Installing Frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install
	@if [ ! -f .env ]; then echo "!!! Warning: Root .env not found !!!"; fi

setup-tools:
	@echo ">>> Ensuring .NET EF tools are installed..."
	-dotnet tool install --global dotnet-ef || dotnet tool update --global dotnet-ef

db-update:
	@echo ">>> Updating database..."
	cd $(BACKEND_DIR) && dotnet ef database update

run-ai:
	@echo ">>> Starting AI Service..."
	@if [ -d $(AI_SERVICE_DIR) ]; then \
		cd $(AI_SERVICE_DIR) && ../venv/Scripts/python main.py; \
	else \
		echo "Error: AI Service directory not found."; \
	fi

run-backend:
	@echo ">>> Starting Backend API..."
	cd $(BACKEND_DIR) && dotnet run

run-frontend:
	@echo ">>> Starting Frontend Web..."
	cd $(FRONTEND_DIR) && npm run dev

watch-backend:
	@echo ">>> Starting Backend API (Watch Mode)..."
	cd $(BACKEND_DIR) && dotnet watch run

run-all:
	@echo ">>> Starting all services concurrently..."
	@echo "Note: This will run AI, Backend, and Frontend."
	@start "AI Service" /min make run-ai
	@start "Backend API" /min make run-backend
	@start "Frontend Web" /min make run-frontend

stop-all:
	@echo ">>> Stopping all running services..."
	-taskkill /F /IM dotnet.exe /T
	-taskkill /F /IM python.exe /T
	-taskkill /F /IM node.exe /T

clean:
	@echo ">>> Cleaning up..."
	-rm -rf ai-service/venv
	-rm -rf frontend/node_modules
	-rm -rf frontend/dist
	@echo "Cleaning .NET artifacts..."
	-find . -type d -name "bin" -exec rm -rf {} +
	-find . -type d -name "obj" -exec rm -rf {} +
	@echo "Done."
