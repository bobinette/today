# First stage: build the application that will be installed
# in the alpine Docker
FROM golang:1.9.5 as builder
# Install dep
RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh
# Copy the backend project in the right folder
WORKDIR /go/src/github.com/bobinette/today/backend
# Install the dependencies
COPY Gopkg.lock Gopkg.lock
COPY Gopkg.toml Gopkg.toml
RUN dep ensure -v -vendor-only
# Copy the rest of the sources to enable caching the dependencies
COPY . .
# Compile
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o today main.go

# Final Docker: smaller size, with the application that should be working just fine
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /go/src/github.com/bobinette/today/backend/today .
# touch conf.toml so that when mounting as a volume (-v) it is not created
# as a directory
RUN touch conf.toml

EXPOSE 9091
CMD ["./today"]
