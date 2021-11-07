FROM alpine:latest AS base

ENV NODE_ENV="development"
ENV PORT="4444"

# where the incoming source code will be saved temporarily
ENV SANDBOX_DIR="/tmp/sandbox"

RUN apk add --no-cache bash bash-doc bash-completion
RUN apk add --no-cache build-base
RUN apk add --no-cache bash
RUN apk add --no-cache openjdk11
RUN apk add --no-cache php7
RUN apk add --no-cache nodejs
RUN apk add --no-cache npm

# ENV FPC_VERSION="3.2.2"
# ENV FPC_ARCH="x86_64-linux"
# RUN apk add --no-cache binutils && \
#     cd /tmp && \
#     wget "ftp://ftp.hu.freepascal.org/pub/fpc/dist/${FPC_VERSION}/${FPC_ARCH}/fpc-${FPC_VERSION}.${FPC_ARCH}.tar" -O fpc.tar && \
#     tar xf "fpc.tar" && \
#     cd "fpc-${FPC_VERSION}.${FPC_ARCH}" && \
#     rm demo* doc* && \
#     \
#     # Workaround musl vs glibc entrypoint for `fpcmkcfg`
#     mkdir /lib64 && \
#     ln -s /lib/ld-musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2 && \
#     \
#     echo -e '/usr\nN\nN\nN\n' | sh ./install.sh && \
#     find "/usr/lib/fpc/${FPC_VERSION}/units/${FPC_ARCH}/" -type d -mindepth 1 -maxdepth 1 \
#         -not -name 'fcl-base' \
#         -not -name 'rtl' \
#         -not -name 'rtl-console' \
#         -not -name 'rtl-objpas' \
#         -exec rm -r {} \; && \
#     rm -r "/lib64" "/tmp/"*

WORKDIR /app/sandbox

COPY package.json ./
RUN npm install
COPY ./ ./



################################
# To be run only in production #
################################
FROM base AS production

ENV NODE_ENV="production"

# how many milliseconds maximum the server will spend in a shell execution
ENV SANDBOX_TIMEOUT=10000

RUN npm install -g pm2

RUN rm build/ -rf
RUN npm run build

CMD ["docker-compose up", "pm2-runtime", "start", "build/index.js"]
#CMD ["pm2-runtime", "start", "build/index.js"]
