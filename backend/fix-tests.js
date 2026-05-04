const fs = require('fs');
const path = require('path');

const traverseDir = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.spec.ts') && !fullPath.includes('app.controller.spec.ts') && !fullPath.includes('patients.controller.spec.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // If it's a controller, mock the service
            if (fullPath.includes('.controller.spec.ts')) {
                const serviceMatch = content.match(/([A-Z][a-zA-Z]+)Controller/);
                if (serviceMatch) {
                    const prefix = serviceMatch[1];
                    const serviceName = prefix + 'Service';
                    
                    if (!content.includes(serviceName)) {
                        content = "import { " + serviceName + " } from './" + prefix.toLowerCase() + ".service';\n" + content;
                    }
                    
                    content = content.replace(
                        /controllers: \[(.+?)\],([\s\S]*?)providers: \[\]/g, 
                        'controllers: [],\n      providers: [{ provide: ' + serviceName + ', useValue: {} }]'
                    );
                    
                    if (!content.includes('providers:')) {
                         content = content.replace(
                            /controllers: \[(.+?)\],/,
                            'controllers: [],\n      providers: [{ provide: ' + serviceName + ', useValue: {} }],'
                        );
                    }
                }
            } 
            // If it's a service, mock the repository
            else if (fullPath.includes('.service.spec.ts')) {
                const serviceMatch = content.match(/([A-Z][a-zA-Z]+)Service/);
                if (serviceMatch) {
                    const prefix = serviceMatch[1];
                    let entPrefix = prefix;
                    if (entPrefix.endsWith('s')) entPrefix = entPrefix.slice(0, -1);
                    console.log('prefix', prefix);
                    
                    const repoName = 'getRepositoryToken(' + entPrefix + ')';
                    
                    if (!content.includes('getRepositoryToken')) {
                        content = "import { getRepositoryToken } from '@nestjs/typeorm';\n" + content;
                        content = "import { " + entPrefix + " } from './entities/" + entPrefix.toLowerCase() + ".entity';\n" + content;
                        
                        // Fallback for users entities etc
                        if (prefix === 'Auth') {
                            content = "import { JwtService } from '@nestjs/jwt';\n" + content;
                            content = content.replace(
                                /providers: \[AuthService\],/,
                                "providers: [AuthService, { provide: 'UsersService', useValue: {} }, { provide: JwtService, useValue: {} }],"
                            );
                        } else {
                            content = content.replace(
                                /providers: \[(.+?)\],/,
                                "providers: [, { provide: getRepositoryToken(" + entPrefix + "), useValue: {} }],"
                            );
                        }
                    }
                }
            }
            fs.writeFileSync(fullPath, content);
        }
    });
};

traverseDir('./src');
console.log('Done mapping.');
