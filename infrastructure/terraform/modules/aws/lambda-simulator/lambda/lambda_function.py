import json
import time
import random
import boto3
from datetime import datetime

# Cliente IoT
iot_client = boto3.client('iot-data', region_name='us-east-1')

# Configuração
IOT_TOPIC = 'factory/pumps/data'
DEVICE_ID = 'PUMP_001'

def generate_sensor_data():
    """Gera dados simulados da bomba"""
    
    # Simular vibração (normal: 0.5-2.0, anomalia: >3.0)
    base_vibration = random.uniform(0.5, 2.0)
    anomaly = random.random() < 0.15  # 15% chance de anomalia
    
    if anomaly:
        vibration = random.uniform(3.0, 5.5)
        temperature = random.uniform(85, 95)
        pressure = random.uniform(45, 55)
    else:
        vibration = base_vibration + random.uniform(-0.2, 0.2)
        temperature = random.uniform(65, 75)
        pressure = random.uniform(48, 52)
    
    # Calcular maintenance score
    maintenance_score = 0
    if vibration > 3.0:
        maintenance_score += 40
    if temperature > 80:
        maintenance_score += 30
    if pressure < 49 or pressure > 51:
        maintenance_score += 20
    
    return {
        'device_id': DEVICE_ID,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'metrics': {
            'vibration': round(vibration, 2),
            'temperature': round(temperature, 2),
            'pressure': round(pressure, 2),
            'flow_rate': round(random.uniform(95, 105), 2),
            'power_consumption': round(random.uniform(18, 22), 2)
        },
        'anomaly_detected': anomaly,
        'maintenance_score': maintenance_score,
        'status': 'CRITICAL' if maintenance_score > 70 else 'WARNING' if maintenance_score > 40 else 'NORMAL'
    }

def lambda_handler(event, context):
    """Handler da Lambda - chamado a cada 10 segundos"""
    
    try:
        # Gerar dados
        sensor_data = generate_sensor_data()
        
        # Publicar no IoT Core
        response = iot_client.publish(
            topic=IOT_TOPIC,
            qos=1,
            payload=json.dumps(sensor_data)
        )
        
        print(f"✅ Dados publicados: {json.dumps(sensor_data, indent=2)}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Data published successfully',
                'data': sensor_data
            })
        }
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }