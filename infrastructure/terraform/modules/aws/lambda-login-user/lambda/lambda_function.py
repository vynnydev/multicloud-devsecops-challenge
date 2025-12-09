import json
import boto3
import os

cognito = boto3.client('cognito-idp', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

CLIENT_ID = os.environ.get('CLIENT_ID')
DYNAMODB_TABLE = os.environ.get('DYNAMODB_TABLE', 'iot-predictive-prod-users')

table = dynamodb.Table(DYNAMODB_TABLE)

def lambda_handler(event, context):
    """
    Autentica usuário no Cognito
    
    Body esperado:
    {
        "username": "vini123",
        "password": "SenhaSegura123"
    }
    """
    
    print(f"📦 Event: {json.dumps(event)}")
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        username = body.get('username')
        password = body.get('password')
        
        if not username or not password:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Usuário e senha são obrigatórios'
                })
            }
        
        print(f"🔐 Autenticando usuário: {username}")
        
        # Autenticar no Cognito
        response = cognito.initiate_auth(
            ClientId=CLIENT_ID,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            }
        )
        
        # Extrair tokens
        tokens = response['AuthenticationResult']
        access_token = tokens['AccessToken']
        id_token = tokens['IdToken']
        refresh_token = tokens['RefreshToken']
        
        # Pegar informações do usuário
        user_info = cognito.get_user(AccessToken=access_token)
        
        user_attributes = {attr['Name']: attr['Value'] for attr in user_info['UserAttributes']}
        user_sub = user_attributes.get('sub')
        
        # Buscar dados extras no DynamoDB
        try:
            db_response = table.get_item(Key={'user_id': user_sub})
            user_data = db_response.get('Item', {})
        except:
            user_data = {}
        
        print(f"✅ Login realizado: {username}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Login realizado com sucesso',
                'access_token': access_token,
                'id_token': id_token,
                'refresh_token': refresh_token,
                'expires_in': tokens['ExpiresIn'],
                'user': {
                    'user_id': user_sub,
                    'username': username,
                    'email': user_attributes.get('email'),
                    'name': user_attributes.get('name'),
                    'location_id': user_attributes.get('custom:location_id', user_data.get('location_id', '')),
                    'email_verified': user_attributes.get('email_verified') == 'true'
                }
            })
        }
        
    except cognito.exceptions.NotAuthorizedException:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Usuário ou senha incorretos'
            })
        }
        
    except cognito.exceptions.UserNotConfirmedException:
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Email não verificado. Verifique seu email primeiro.'
            })
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }