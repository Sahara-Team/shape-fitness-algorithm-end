FROM ubuntu:18.04

WORKDIR /tmp

RUN apt-get update && apt install software-properties-common -y \ 
		&& add-apt-repository ppa:deadsnakes/ppa \
		&& apt-get --no-install-recommends install -y \
		python3.7
        git \
        cmake \
        g++ \


RUN git clone https://github.com/Sahara-Team/Shape-Fitness.git
    && pip install -r Shape-Fitness/requirements.txt
	&& cd Shape—Fitness/end/server
	&& python3 server.py