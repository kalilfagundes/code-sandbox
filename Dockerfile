FROM alpine:latest AS base
ENV NODE_ENV="development"
# where the incoming source code will be saved temporarily
ENV SANDBOX_DIR="/tmp/sandbox"

# Install all base packages and dependencies in a single layer
# This is more efficient and includes the 'wget' needed for the next step
RUN apk add --no-cache \
    bash \
    bash-doc \
    bash-completion \
    build-base \
    curl \
    openjdk11 \
    php83 \
    nodejs \
    npm \
    python3 \
    py3-pip \
    binutils \
    wget \
    dos2unix


# Instalar bibliotecas Python
RUN pip3 install --no-cache-dir --break-system-packages \
    requests \
    pandas \
    numpy

# Install Free Pascal (FPC)
ENV FPC_VERSION="3.2.2"
ENV FPC_ARCH="x86_64-linux"
RUN cd /tmp && \
    # Use the reliable SourceForge HTTPS mirror instead of the failing FTP link
    wget "https://sourceforge.net/projects/freepascal/files/Linux/${FPC_VERSION}/fpc-${FPC_VERSION}.${FPC_ARCH}.tar/download" -O fpc.tar && \
    tar xf "fpc.tar" && \
    cd "fpc-${FPC_VERSION}.${FPC_ARCH}" && \
    rm demo* doc* && \
    \
    mkdir /lib64 && \
    ln -s /lib/ld-musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2 && \
    \
    echo -e '/usr\nN\nN\nN\n' | sh ./install.sh && \
    find "/usr/lib/fpc/${FPC_VERSION}/units/${FPC_ARCH}/" -type d -mindepth 1 -maxdepth 1 \
        -not -name 'fcl-base' \
        -not -name 'rtl' \
        -not -name 'rtl-console' \
        -not -name 'rtl-objpas' \
        -exec rm -r {} \; && \
    rm -r "/lib64" "/tmp/"*

WORKDIR /app/sandbox

COPY package.json ./
RUN npm install

COPY ./ ./

# Converter line endings E dar permissão
RUN find scripts -type f -name "*.sh" -exec dos2unix {} \; && \
    chmod +x scripts/*/*.sh

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

# Garantir line endings corretos no production também
RUN find scripts -type f -name "*.sh" -exec dos2unix {} \; && \
    chmod +x scripts/*/*.sh

EXPOSE $PORT
CMD ["pm2-runtime", "start", "build/index.js"]
