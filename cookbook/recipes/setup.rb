git '/home/vagrant/mondedie-chat' do
  repository 'https://bitbucket.org/Hardware/mondedie-chat'
  revision 'master'
  enable_submodules false
  action :sync
  user 'vagrant'
end

template '/home/vagrant/mondedie-chat/.env' do
  source 'env'
  not_if { ::File.exists?('/home/vagrant/mondedie-chat/.env') }
end

script 'chat' do
  interpreter 'bash'
  cwd '/home/vagrant'
  code <<-EOH
    su vagrant -l -c 'bash ~/share/install.sh'
  EOH
end