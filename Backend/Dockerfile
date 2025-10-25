# =========================
# BUILD STAGE
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy toàn bộ solution và restore dependencies
COPY ["App.sln", "./"]
COPY ["src/App.API/App.API.csproj", "src/App.API/"]
COPY ["src/App.Application/App.Application.csproj", "src/App.Application/"]
COPY ["src/App.Domain/App.Domain.csproj", "src/App.Domain/"]
COPY ["src/App.Infrastructure/App.Infrastructure.csproj", "src/App.Infrastructure/"]

RUN dotnet restore "src/App.API/App.API.csproj"

# Copy toàn bộ source code và build
COPY . .
WORKDIR "/src/src/App.API"
RUN dotnet publish -c Release -o /app/publish

# =========================
# RUNTIME STAGE
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "App.API.dll"]
