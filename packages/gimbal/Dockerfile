FROM centos:latest AS Gimbal

ARG GIMBAL_VERSION

# Install packages
RUN	yum update  -y \
  && yum install -y gcc-c++ make curl libX11-devel libXcomposite libXcursor libXdamage \
  && yum clean all \
  && curl -sL https://rpm.nodesource.com/setup_10.x | bash - \
  && yum install -y nodejs \
  && npm install -g --unsafe-perm=true --allow-root @modus/gimbal@${GIMBAL_VERSION}

RUN yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc  libXext cups-libs libXScrnSaver -y

RUN yum install alsa-lib pango -y

RUN yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y

CMD ["/bin/sh"]
