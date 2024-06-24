FROM nvcr.io/nvidia/l4t-jetpack:r36.3.0

# Set the environment variable to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    pkg-config \
    git \
    openssl \
    libssl-dev \
    build-essential \
    libhdf5-dev \
    python3-venv \
    libglu1-mesa-dev \
    nano \
    libxi-dev \
    curl \
    libglew-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libhdf5-serial-dev \
    hdf5-tools \
    zlib1g-dev \
    zip \ 
    libjpeg8-dev \
    liblapack-dev \
    libblas-dev \
    gfortran \
    libtesseract4 \
    libatlas3-base \
    libzmq3-dev \
    xvfb \
    cmake \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pip

# Install specific Python packages
RUN pip3 install -U testresources setuptools==65.5.0

RUN pip3 install -U numpy==1.22 \
  future==0.18.2 \
  mock==3.0.5 \
  keras_preprocessing==1.1.2 \
  keras_applications==1.0.8 \
  gast==0.4.0 \
  protobuf \
  pybind11 \
  cython \
  pkgconfig \
  packaging \
  h5py==3.7.0

# Set the working directory in the container
WORKDIR /app

# Copy the project files into the working directory
COPY . . 

# Install NVIDIA codec SDK
COPY docker/opencv/libnvcuvid.so /usr/local/cuda/lib64/
COPY docker/opencv/libnvidia-encode.so /usr/local/cuda/lib64/
COPY docker/opencv/cuviddec.h /usr/local/cuda/include/
COPY docker/opencv/nvcuvid.h /usr/local/cuda/include/
COPY docker/opencv/nvEncodeAPI.h /usr/local/cuda/include/

# Download and install OpenCV
RUN chmod +x docker/opencv/OpenCV-unknown-aarch64.sh \
    && ./docker/opencv/OpenCV-unknown-aarch64.sh --prefix=/usr/local --skip-license --exclude-subdir

# Install TensorFlow
RUN pip3 install --extra-index-url https://developer.download.nvidia.cn/compute/redist/jp/v60/ tensorflow==2.15.0+nv24.05

# Install OpenCV libraries
RUN apt-get update && apt-get install -y \
    libopencv-core-dev \
    libopencv-highgui-dev \
    libopencv-calib3d-dev \
    libopencv-features2d-dev \
    libopencv-imgproc-dev \
    libopencv-video-dev \
    libopencv-contrib-dev

# Uncomment the following to build MediaPipe from source
# RUN python3 -m pip install --upgrade pip setuptools

# Install Bazel
# RUN wget https://github.com/bazelbuild/bazel/releases/download/6.4.0/bazel-6.4.0-linux-arm64 \
#     && chmod +x bazel-6.4.0-linux-arm64 \
#     && mv bazel-6.4.0-linux-arm64 /usr/local/bin/bazel

# # Install protoc
# RUN curl -OL https://github.com/google/protobuf/releases/download/v3.19.1/protoc-3.19.1-linux-aarch_64.zip \
#     && unzip protoc-3.19.1-linux-aarch_64.zip -d protoc3 \
#     && rm protoc-3.19.1-linux-aarch_64.zip \
#     && cp -r protoc3/bin/* /usr/local/bin/ \
#     && cp -r protoc3/include/* /usr/local/include/ \
#     && ldconfig

# RUN curl -OL https://b33r.s3.amazonaws.com/mediapipe-0.10.14-jetson.zip \
#     && unzip mediapipe-0.10.14-jetson.zip \
#     && rm mediapipe-0.10.14-jetson.zip
   
# Clone and build MediaPipe
# RUN cd mediapipe-0.10.14 \
#     && export TF_CUDA_PATHS=/usr/local/cuda-12.2:/usr/lib/aarch64-linux-gnu:/usr/include \
#     && export CPLUS_INCLUDE_PATH=/usr/include/opencv4:$CPLUS_INCLUDE_PATH \
#     && export MEDIAPIPE_DISABLE_GPU=0 \
#     && export MEDIAPIPE_OMIT_EGL_WINDOW_BIT=1 \
#     && python3 setup.py gen_protos \
#     && python3 setup.py bdist_wheel

RUN python3 -m pip install docker/mediapipe/mediapipe-0.10.14-cp310-cp310-linux_aarch64.whl \
    && python3 -m pip uninstall -y matplotlib \
    && python3 -m pip install matplotlib \
    && python3 -m pip install pyzmq \
    && python3 -m pip install scikit-image

# Install Node.js and PM2
ENV NODE_VERSION=22.1.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} \
    && . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION} \
    && . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version \
    && npm --version \
    && npm install -g pm2

# Install the project dependencies
RUN npm install

# Expose the ports the app runs on
EXPOSE 3000 7071
CMD ["pm2-runtime", "start", "npm", "--", "start"]