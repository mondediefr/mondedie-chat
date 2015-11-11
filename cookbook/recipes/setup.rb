cookbook_file '/home/vagrant/mondedie-chat/.env' do
  source 'env'
  action :create
end

script 'chat' do
  interpreter 'bash'
  cwd '/home/vagrant'
  code <<-EOH
    su vagrant -l -c 'bash /home/vagrant/mondedie-chat/cookbook/files/install.sh'
  EOH
end
