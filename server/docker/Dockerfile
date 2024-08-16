# base image
FROM jenkins/jenkins:lts-jdk17

# Switch to root to install Docker CLI
USER root

# Install necessary packages
RUN apt-get update && \
    apt-get install -y apt-transport-https \
                       ca-certificates \
                       curl \
                       gnupg \
                       lsb-release

# Add Docker's official GPG key
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the Docker repository
RUN echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker CLI only
RUN apt-get update && \
    apt-get install -y docker-ce-cli

# Create the docker group if it doesn't exist
RUN groupadd -f docker

# Add jenkins user to the docker group
RUN usermod -aG docker jenkins

# Clean up
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Switch back to jenkins user
USER jenkins

# Set the PATH to include Docker binaries
ENV PATH="/usr/bin:${PATH}"
