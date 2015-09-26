# -*- mode: ruby -*-
# vi: set ft=ruby :

project_name = 'mondedie-chat'

Vagrant.configure(2) do |config|

  config.vm.box = 'ubuntu/trusty64'
  config.vm.box_url = 'ubuntu/trusty64'
  config.vm.network "forwarded_port", guest: 5000, host: 5000
  config.vm.synced_folder '.', '/home/vagrant/mondedie-chat', :mount_options => ['dmode=777', 'fmode=666']

  config.vm.provider 'virtualbox' do |vb|
    vb.gui = false
    vb.memory = '2048'
  end

  config.berkshelf.enabled = true

  config.vm.provision :chef_solo do |chef|

    chef.add_recipe 'apt'
    chef.add_recipe 'build-essential'
    chef.add_recipe 'redisio'
    chef.add_recipe 'redisio::enable'
    chef.add_recipe 'chat::packages'
    chef.add_recipe 'chat::nodejs'
    chef.add_recipe 'chat::setup'

    chef.json = {
      :chat => {
        :packages => %W{ vim git curl },
        :npm_packages => %W{ pm2 bower grunt-cli }
      }
    }
  end

  # Configuration du host manager
  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true

  # Setup de l'ip par rapport aux paramètres globaux
  config.vm.hostname = project_name + '.dev'
  config.vm.network :private_network, ip: '127.0.0.1'
  config.vm.provision :hostmanager

end
