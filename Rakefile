require 'open3'

task default: :test

desc 'Install dependencies & setup the dummy application'
task install: 'dummy:setup' do
  sh 'yarn install'
  sh 'yarn playwright install --with-deps'
end

desc 'Run Playwright tests'
task test: :install do
  sh 'yarn playwright test'
end

desc 'Open the Playwright test runner app'
task test_ui: :install do
  sh 'yarn playwright test --ui'
end

task clean: 'dummy:clean' do
  sh 'rm -rf test-results playwright-report'
end

namespace :dummy do
  desc 'Setup the dummy application'
  task :setup do
    Dir.chdir('test/dummy') do
      sh 'bin/setup --skip-server'
    end
  end

  task :clean do
    Dir.chdir('test/dummy') do
      sh 'bin/rails assets:clobber log:clear tmp:clear'
    end
  end

  desc 'Run the dummy application on the specified port (default: 3000)'
  task :run, %i[port] => :setup do |_t, args|
    Dir.chdir('test/dummy') do
      Open3.popen2e({ 'PORT' => args.fetch(:port, '3000') }, 'bin/dev') do |_, output|
        output.each_line { puts _1 }
      end
    end
  end
end
