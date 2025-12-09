import json
import boto3
import os
from datetime import datetime
import uuid

cognito = boto3.client('cognito-idp', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

USER_POOL_ID = os.environ.get('USER_POOL_ID')
CLIENT_ID = os.environ.get('CLIENT_ID')
DYNAMODB_TABLE = os.environ.get('DYNAMODB_TABLE', 'iot-predictive-prod-users')

table = dynamodb.Table(DYNAMODB_TABLE)

def lambda_handler(event, context):
    """
    Registra novo usuário no Cognito e DynamoDB
    
    Body esperado:
    {
        "name": "Vinicius Prudencio",
        "email": "vini@example.com",
        "username": "vini123",
        "location_id": "factory-001",
        "password": "SenhaSegura123"
    }
    """
    
    print(f"📦 Event: {json.dumps(event)}")
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        name = body.get('name')
        email = body.get('email')
        username = body.get('username')
        location_id = body.get('location_id', '')
        password = body.get('password')
        
        # Validações
        if not all([name, email, username, password]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Todos os campos são obrigatórios'
                })
            }
        
        # Criar usuário no Cognito
        print(f"👤 Criando usuário no Cognito: {username}")
        
        cognito_response = cognito.sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            Password=password,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
                {'Name': 'name', 'Value': name},
                {'Name': 'custom:location_id', 'Value': location_id}
            ]
        )
        
        user_sub = cognito_response['UserSub']
        
        print(f"✅ Usuário criado no Cognito: {user_sub}")
        
        # Salvar dados extras no DynamoDB
        user_data = {
            'user_id': user_sub,
            'username': username,
            'email': email,
            'name': name,
            'location_id': location_id,
            'created_at': datetime.utcnow().isoformat() + 'Z',
            'updated_at': datetime.utcnow().isoformat() + 'Z',
            'is_active': True,
            'email_verified': False
        }
        
        table.put_item(Item=user_data)
        
        print(f"✅ Dados salvos no DynamoDB")
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Usuário criado com sucesso! Verifique seu email.',
                'user_id': user_sub,
                'username': username,
                'email': email,
                'email_verification_required': True
            })
        }
        
    except cognito.exceptions.UsernameExistsException:
        return {
            'statusCode': 409,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Nome de usuário já existe'
            })
        }
        
    except cognito.exceptions.InvalidPasswordException as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Senha inválida. Use no mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.'
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