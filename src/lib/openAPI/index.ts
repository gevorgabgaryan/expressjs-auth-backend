import { getMetadataArgsStorage, RoutingControllersOptions } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataStorage } from 'class-validator';
import controllers from '../../api/controllers';
import config from '../../config';

export async function openAPISpec() {
  const routingControllersOptions: RoutingControllersOptions = {
    controllers,
  };

  const storage = getMetadataArgsStorage();

  const schemas: any = validationMetadatasToSchemas({
    classValidatorMetadataStorage: getMetadataStorage(),
    refPointerPrefix: '#/components/schemas/',
  });

  const spec = routingControllersToSpec(storage, routingControllersOptions, {
    components: {
      schemas,
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    info: {
      title: 'Auth API',
      description: 'Express auth api',
      version: '1.0.0',
    },
    storage,
  });

  const prefixedSpec = {
    ...spec,
    paths: Object.keys(spec.paths).reduce(
      (result, path) => {
        result[`${config.routePrefix}${path}`] = spec.paths[path];
        return result;
      },
      {} as Record<string, any>,
    ),
  };

  return prefixedSpec;

  return spec;
}
