#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/runtime:3.1-buster-slim AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["CustomPrometheusExporter/CustomPrometheusExporter.csproj", "CustomPrometheusExporter/"]
RUN dotnet restore "CustomPrometheusExporter/CustomPrometheusExporter.csproj"
COPY . .
WORKDIR "/src/CustomPrometheusExporter"
RUN dotnet build "CustomPrometheusExporter.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CustomPrometheusExporter.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CustomPrometheusExporter.dll"]