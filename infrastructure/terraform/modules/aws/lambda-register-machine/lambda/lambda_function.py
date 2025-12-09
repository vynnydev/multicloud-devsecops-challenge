import json
import boto3
from datetime import datetime
import os

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Pegar nome da tabela da variável de ambiente
TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'iot-predictive-prod-industry-machines')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """Cadastra uma máquina no inventário da indústria"""
    
    print(f"📦 Event: {json.dumps(event)}")
    print(f"🗄️ Table name: {TABLE_NAME}")
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        machine_id = body.get('machine_id')
        machine_name = body.get('machine_name')
        
        if not machine_id or not machine_name:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'machine_id and machine_name are required'})
            }
        
        # Criar registro
        machine = {
            'machine_id': machine_id,
            'machine_name': machine_name,
            'model': body.get('model', ''),
            'location': body.get('location', ''),
            'manufacturer': body.get('manufacturer', 'Indústria Central'),
            'status': 'OPERATIONAL',
            'created_at': datetime.utcnow().isoformat() + 'Z',
            'updated_at': datetime.utcnow().isoformat() + 'Z'
        }
        
        # Salvar no DynamoDB
        print(f"💾 Salvando no DynamoDB: {json.dumps(machine)}")
        response = table.put_item(Item=machine)
        print(f"✅ DynamoDB response: {json.dumps(response, default=str)}")
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'message': 'Machine registered successfully',
                'machine': machine
            })
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }