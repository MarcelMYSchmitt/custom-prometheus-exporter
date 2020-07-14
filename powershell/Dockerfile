FROM mcr.microsoft.com/powershell:latest

# ENV variables will be provided via docker-compose or build pipeline
ENV URL "should_be_replaced_from_the_outside"
ENV CLIENTID "should_be_replaced_from_the_outside"
ENV CLIENTPASSWORD "should_be_replaced_from_the_outside"

# Install curl and jq
# Install dependencies and clean up
RUN apt-get update && apt-get -y install \
        curl \
        jq && \
    rm -rf /var/lib/apt/lists/*

# Add powershell scripts
ADD GetMetrics.ps1 .
ADD Functions.ps1 .

# Run script using parameters from compose file
CMD pwsh -File GetMetrics.ps1 -URL ${URL} -CLIENTID ${CLIENTID} -CLIENTPASSWORD ${CLIENTPASSWORD}