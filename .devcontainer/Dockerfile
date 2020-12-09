#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------
FROM node:10.15

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# The node image comes with a base non-root 'node' user which this Dockerfile
# gives sudo access. However, for Linux, this user's GID/UID must match your local
# user UID/GID to avoid permission issues with bind mounts. Update USER_UID / USER_GID
# if yours is not 1000. See https://aka.ms/vscode-remote/containers/non-root-user.
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Configure apt and install packages
WORKDIR /tmp
RUN apt-get update \
    && apt-get -y install --no-install-recommends \
        apt-utils \
        dialog \
        gettext \
        groff \
        jq \
        less \
        vim \
        locales \
        python3-pip \
        python3-setuptools \
        zsh 2>&1 \
    #
    # Verify git and needed tools are installed
    && apt-get install -y git procps \
    #
    # Create a non-root user to use if preferred - see https://aka.ms/vscode-remote/containers/non-root-user.
    && if [ "$USER_GID" != "1000" ]; then groupmod node --gid $USER_GID; fi \
    && if [ "$USER_UID" != "1000" ]; then usermod --uid $USER_UID node; fi \
    # [Optional] Add sudo support for non-root users
    && apt-get install -y sudo \
    && echo node ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node \
    #
    # Install latest git
    && git clone --depth 1 git://git.kernel.org/pub/scm/git/git.git \
    && cd git \
    && make configure \
    && ./configure --prefix=/usr/local \
    && make all \
    && make install \
    # Make diff-highlight
    && cd contrib/diff-highlight \
    && make all \
    && mv diff-highlight /usr/local/bin \
    && cd /tmp \
    && rm -rf /tmp/git \
    # Remove old git
    && apt remove -y --purge git \
    #
    # Clean up
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    #
    # Enable diff-highlight
    && echo "ja_JP.UTF-8 UTF-8" >> /etc/locale.gen \
    && echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
    && locale-gen \
    #
    # Install peco
    && curl -OL https://github.com/peco/peco/releases/download/v0.5.3/peco_linux_amd64.tar.gz \
    && tar -xzf peco_linux_amd64.tar.gz \
    && cp -p peco_linux_amd64/peco /usr/local/bin \
    && rm -rf peco_linux_amd64 peco_linux_amd64.tar.gz \
    #
    # Install CircleCI CLI
    && curl -fLSs https://circle.ci/cli | bash

COPY ngrok-stable-linux-386.zip /usr/local/bin/
RUN cd /usr/local/bin/ \
    && unzip ngrok-stable-linux-386.zip

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=

USER node

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" \
    && echo 'function peco-select-history() {'       >> ~/.zshrc \
    && echo '    local tac'                          >> ~/.zshrc \
    && echo '    if which tac > /dev/null; then'     >> ~/.zshrc \
    && echo '        tac="tac"'                      >> ~/.zshrc \
    && echo '    else'                               >> ~/.zshrc \
    && echo '        tac="tail -r"'                  >> ~/.zshrc \
    && echo '    fi'                                 >> ~/.zshrc \
    && echo ''                                       >> ~/.zshrc \
    && echo '    BUFFER=$(\history -n 1 | \\'        >> ~/.zshrc \
    && echo '        eval $tac | \\'                 >> ~/.zshrc \
    && echo '        peco --query "$LBUFFER")'       >> ~/.zshrc \
    && echo '    CURSOR=$#BUFFER'                    >> ~/.zshrc \
    && echo ''                                       >> ~/.zshrc \
    && echo '    zle clear-screen'                   >> ~/.zshrc \
    && echo '}'                                      >> ~/.zshrc \
    && echo 'zle -N peco-select-history'             >> ~/.zshrc \
    && echo "bindkey '^R' peco-select-history"       >> ~/.zshrc \
    && echo ''                                       >> ~/.zshrc \
    && echo 'export PATH=${HOME}/.local/bin:${PATH}' >> ~/.zshrc \
    #
    # Install aws cli
    # `awscli` installation will fail if `wheel` is not installed before `awscli`.
    && pip3 install --upgrade --user wheel \
    && pip3 install --upgrade --user awscli
