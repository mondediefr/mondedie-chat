include_recipe 'nvm'

nvm_install 'v0.12.7' do
  user 'vagrant'
  group 'vagrant'
  from_source false
  alias_as_default true
  action :create
end

# global packages
node['chat']['npm_packages'].each do |n_package|
  script n_package do
    interpreter 'bash'
    cwd '/home/vagrant'
    code "su vagrant -l -c 'npm install #{n_package} -g'"
    # Ne pas installer si déjà présent
    not_if "su vagrant -l -c 'npm list --depth=0 -g #{n_package}'"
  end
end