FROM golang:1.13 as build

WORKDIR /go/src/github.com/marcelmyschmitt/custom-prometheus-exporter/go

COPY ./go.mod /go/src/github.com/marcelmyschmitt/custom-prometheus-exporter/go
RUN go mod download

# Compile
COPY ./ /go/src/github.com/marcelmyschmitt/custom-prometheus-exporter/go
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags '-extldflags "-static"' -o /go \
    && chmod +x /go


# FINAL IMAGE
FROM gcr.io/distroless/static
COPY --from=build /go /
USER 1000
ENTRYPOINT ["/go"]