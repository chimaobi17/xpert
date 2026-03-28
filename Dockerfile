FROM alpine:3.19
RUN echo "Build test successful"
EXPOSE 8000
CMD ["echo", "hello from xpert"]
