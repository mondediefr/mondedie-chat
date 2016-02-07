name 'chat'
maintainer 'hardware, magicalex'
maintainer_email 'contact@meshup.net'
description 'Mondedie-chat vagrant box'
version '1.3.0'

recipe 'chat', 'Mondedie-chat installation recipies'

depends 'apt'
depends 'nvm'
depends 'nginx'

%W{ debian ubuntu }.each do |os|
  supports os
end
