require 'open3'

task default: :test

task test: 'dummy:setup' do
  sh 'npx playwright test --reporter=dot'
end

task test_ui: 'dummy:setup' do
  sh 'npx playwright test --ui'
end

namespace :dummy do
  desc 'Setup the dummy application'
  task :setup do
    Dir.chdir('test/dummy') do
      rm_rf 'node_modules'
      sh 'bin/setup'
    end
  end

  desc 'Run the dummy application on port 3000'
  task run: :setup do
    Dir.chdir('test/dummy') do
      Open3.popen2e({'PORT' => '3000'}, 'foreman start -f Procfile.dev') do |_, output|
        output.each_line { puts _1 }
      end
    end
  end
end
