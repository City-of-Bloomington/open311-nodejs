#!groovy

def helmLint(String chart_dir) {
    // lint helm chart
    sh "/usr/local/bin/helm lint ${chart_dir} --values ${chart_values}"

}

def helmDeploy(Map args) {
    //configure helm client and confirm tiller process is installed

    if (args.dry_run) {
        println "Running dry-run deployment"

        sh "/usr/local/bin/helm upgrade --dry-run --debug --install ${args.name} ${chart_dir} --set image.tag=${build_tag},Replicas=${args.replicas},Cpu=${args.cpu},Memory=${args.memory},DomainName=${args.name} --namespace=jenkins-auto --values ${chart_values}"
    } else {
        println "Running deployment"
        sh "/usr/local/bin/helm upgrade --atomic --recreate-pods --install ${args.name} ${chart_dir} --set image.tag=${build_tag},Replicas=${args.replicas},Cpu=${args.cpu},Memory=${args.memory},DomainName=${args.name} --namespace=jenkins-auto --values ${chart_values}"

        echo "Application ${args.name} successfully deployed. Use helm status ${args.name} to check"
    }
}

node {

    stage ('Checking out GitHub Repo'){
        checkout scm
        sh "git rev-parse --short HEAD > /tmp/_commitrev"
        build_tag = readFile '/tmp/_commitrev' 
        build_tag = build_tag.trim() // stops issues with newlines on end of commit tag
        def inputFile = readFile('JenkinsConfig.json')
        def config = new groovy.json.JsonSlurperClassic().parseText(inputFile)
    }

        
    // Setup the Docker Registry (Docker Hub) + Credentials 
    registry_url = "https://docker-repo.bloomington.in.gov/cob" // Docker Repo
    docker_creds_id = "9617fef9-766f-4374-9304-43ca4ef33834" // name of the Jenkins Credentials ID

    pwd = pwd()
    chart_dir = "${pwd}/charts/${config.app.name}"
    chart_values = "/opt/helm/${config.app.name}-test.values.yaml"

    stage ('Building container'){
        docker.withRegistry("${registry_url}", "${docker_creds_id}") {
        
            // Set up the container to build 
            maintainer_name = "${config.app.maintainer}"
            container_name = "cob/${config.app.name}"

            stage "Building"
            echo "Building with docker.build(${maintainer_name}/${container_name}:${build_tag})"
            container = docker.build("${container_name}:${build_tag}", '.')

            container.push()
        }
    }

    stage ('helm test') {
        
        // run helm chart linter
        helmLint(chart_dir)

        // run dry-run helm chart installation
        helmDeploy(
        dry_run       : true,
        name          : config.app.name,
        replicas      : config.app.replicas,
        cpu           : config.app.cpu,
        memory        : config.app.memory
        )
    }

    stage ('helm deploy') {
        
        // Deploy using Helm chart
        helmDeploy(
        dry_run       : false,
        name          : config.app.name,
        replicas      : config.app.replicas,
        cpu           : config.app.cpu,
        memory        : config.app.memory
        )
    }
}