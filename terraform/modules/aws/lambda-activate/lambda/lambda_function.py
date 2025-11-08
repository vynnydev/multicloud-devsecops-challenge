import json
import boto3
from datetime import datetime
import os

# Clientes AWS
iot_client = boto3.client('iot-data', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Configuração
IOT_TOPIC = os.environ.get('IOT_TOPIC', 'factory/pumps/data')
DYNAMODB_TABLE = os.environ.get('DYNAMODB_TABLE', 'machines-status')

def lambda_handler(event, context):
    """
    Ativa uma máquina e envia para IoT Core
    
    Body esperado:
    {
        "machine_id": "PUMP_001",
        "machine_name": "Bomba Centrífuga",
        "model": "BC-2500",
        "action": "activate" ou "maintenance"
    }
    """
    
    print(f"Event received: {json.dumps(event)}")
    
    try:
        # Parse body
        body = json.loads(event.get('body', '{}'))
        
        machine_id = body.get('machine_id')
        machine_name = body.get('machine_name', 'Unknown')
        model = body.get('model', 'Unknown')
        action = body.get('action', 'activate')
        
        if not machine_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'machine_id is required'
                })
            }
        
        # Criar mensagem para IoT
        message = {
            'device_id': machine_id,
            'device_name': machine_name,
            'model': model,
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'action': action,
            'status': 'ACTIVE' if action == 'activate' else 'MAINTENANCE',
            'metrics': {
                'vibration': 0.0,
                'temperature': 0.0,
                'pressure': 0.0,
                'flow_rate': 0.0,
                'power_consumption': 0.0
            },
            'anomaly_detected': False,
            'maintenance_score': 0
        }
        
        # Publicar no IoT Core
        response = iot_client.publish(
            topic=IOT_TOPIC,
            qos=1,
            payload=json.dumps(message)
        )
        
        print(f"✅ Message published to IoT Core: {json.dumps(message)}")
        
        # Salvar status no DynamoDB (opcional)
        try:
            table = dynamodb.Table(DYNAMODB_TABLE)
            table.put_item(Item={
                'machine_id': machine_id,
                'timestamp': message['timestamp'],
                'machine_name': machine_name,
                'model': model,
                'status': message['status'],
                'action': action,
                'ttl': int(datetime.utcnow().timestamp()) + (30 * 24 * 60 * 60)  # 30 dias
            })
        except Exception as db_error:
            print(f"⚠️ DynamoDB error (não crítico): {str(db_error)}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Machine activated successfully',
                'machine_id': machine_id,
                'action': action,
                'data': message
            })
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
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