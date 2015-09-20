name 'chat'
maintainer 'hardware'
maintainer_email 'contact@meshup.net'
description 'Mondedie-chat vagrant box'
version '1.0.0'

recipe 'chat', 'Mondedie-chat installation recipies'

depends 'apt'
depends 'nvm'

%W{ debian ubuntu }.each do |os|
  supports os
end