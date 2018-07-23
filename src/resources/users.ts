import Resource from './resource';
import UserRepresentation from '../defs/userRepresentation';
import { KeycloakAdminClient } from '../client';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import RoleRepresentation, {RoleMappingPayload} from '../defs/roleRepresentation';
import { RequiredActionAlias } from '../defs/requiredActionProviderRepresentation';

export interface UserQuery {
  email?: string;
  first?: number;
  firstName?: string;
  lastName?: string;
  max?: number;
  search?: string;
  username?: string;
}

export class Users extends Resource {
  public find = this.makeRequest<UserQuery, UserRepresentation[]>({
    method: 'GET'
  });

  public create = this.makeRequest<UserRepresentation, void>({
    method: 'POST'
  });

  /**
   * Single user
   */

  public findOne = this.makeRequest<{id: string}, UserRepresentation>({
    method: 'GET',
    path: '/{id}',
    urlParams: ['id'],
    catchNotFound: true
  });

  public update = this.makeUpdateRequest<{id: string}, UserRepresentation, void>({
    method: 'PUT',
    path: '/{id}',
    urlParams: ['id']
  });

  public del = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/{id}',
    urlParams: ['id']
  });

  /**
   * role mappings
   */

  public listRoleMappings = this.makeRequest<{id: string}, MappingsRepresentation>({
    method: 'GET',
    path: '/{id}/role-mappings',
    urlParams: ['id']
  });

  public addRealmRoleMappings = this.makeRequest<{id: string, roles: RoleMappingPayload[]}, void>({
    method: 'POST',
    path: '/{id}/role-mappings/realm',
    urlParams: ['id'],
    payloadKey: 'roles'
  });

  public listRealmRoleMappings = this.makeRequest<{id: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/role-mappings/realm',
    urlParams: ['id']
  });

  public delRealmRoleMappings = this.makeRequest<{id: string, roles: RoleMappingPayload[]}, void>({
    method: 'DELETE',
    path: '/{id}/role-mappings/realm',
    urlParams: ['id'],
    payloadKey: 'roles'
  });

  public listAvailableRealmRoleMappings = this.makeRequest<{id: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/role-mappings/realm/available',
    urlParams: ['id']
  });

  /**
   * Client role mappings
   * https://www.keycloak.org/docs-api/4.1/rest-api/#_client_role_mappings_resource
   */

  public listClientRoleMappings = this.makeRequest<{id: string, clientUniqueId: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/role-mappings/clients/{clientUniqueId}',
    urlParams: ['id', 'clientUniqueId']
  });

  public addClientRoleMappings =
    this.makeRequest<{id: string, clientUniqueId: string, roles: RoleMappingPayload[]}, void>({
    method: 'POST',
    path: '/{id}/role-mappings/clients/{clientUniqueId}',
    urlParams: ['id', 'clientUniqueId'],
    payloadKey: 'roles'
  });

  public delClientRoleMappings =
    this.makeRequest<{id: string, clientUniqueId: string, roles: RoleMappingPayload[]}, void>({
    method: 'DELETE',
    path: '/{id}/role-mappings/clients/{clientUniqueId}',
    urlParams: ['id', 'clientUniqueId'],
    payloadKey: 'roles'
  });

  public listAvailableClientRoleMappings =
    this.makeRequest<{id: string, clientUniqueId: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/role-mappings/clients/{clientUniqueId}/available',
    urlParams: ['id', 'clientUniqueId']
  });

  /**
   * Send a update account email to the user
   * an email contains a link the user can click to perform a set of required actions.
   */
  public executeActionsEmail = this.makeRequest<{
      id: string,
      clientId?: string,
      lifespan?: number,
      redirectUri?: string,
      actions?: RequiredActionAlias[]
    }, void>({
    method: 'PUT',
    path: '/{id}/execute-actions-email',
    urlParams: ['id'],
    payloadKey: 'actions',
    querystring: ['lifespan'],
    keyTransform: {
      clientId: 'client_id',
      redirectUri: 'redirect_uri'
    }
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/users',
      urlParams: {
        realm: client.realmName
      }
    });
  }
}
