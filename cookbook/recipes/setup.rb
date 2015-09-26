template '/home/vagrant/mondedie-chat/.env' do
  source 'env'
  not_if { ::File.exists?('/home/vagrant/mondedie-chat/.env') }
end

script 'chat' do
  interpreter 'bash'
  cwd '/home/vagrant'
  code <<-EOH
    su vagrant -l -c 'bash /home/vagrant/mondedie-chat/share/install.sh'
  EOH
end
