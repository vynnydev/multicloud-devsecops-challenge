import json
import boto3
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('machines-status')

def lambda_handler(event, context):
    """
    Lista máquinas em manutenção/análise
    Retorna no formato completo esperado pelo frontend de análise
    """
    
    try:
        # Scan table
        response = table.scan()
        items = response.get('Items', [])
        
        # Ordenar por timestamp (mais recentes primeiro)
        items_sorted = sorted(
            items,
            key=lambda x: x.get('timestamp', ''),
            reverse=True
        )
        
        # Formatar para o frontend de análise
        machines = []
        for item in items_sorted:
            machine_id = item.get('machine_id', 'UNKNOWN')
            machine_name = item.get('machine_name', 'Unknown Machine')
            model = item.get('model', 'Unknown')
            
            # Detectar tipo pela nome
            machine_type = detect_machine_type(machine_name.lower())
            
            # Status baseado no action
            status = 'maintenance' if item.get('action') == 'maintenance' else 'operational'
            
            # Calcular próxima manutenção (exemplo: 90 dias)
            last_maintenance = item.get('timestamp', datetime.utcnow().isoformat())[:10]
            next_maintenance = (datetime.fromisoformat(last_maintenance) + timedelta(days=90)).strftime('%Y-%m-%d')
            
            machine_data = {
                'id': machine_id,
                'name': machine_name,
                'model': model,
                'type': machine_type,
                'status': status,
                'location': item.get('location', 'Factory Floor'),
                'lastMaintenance': last_maintenance,
                'nextMaintenance': next_maintenance,
                'efficiency': 94,  # Default
                'metrics': {
                    'temperature': 65,
                    'temperatureStatus': 'normal',
                    'vibration': 2.1,
                    'vibrationStatus': 'normal',
                    'pressure': 8.5,
                    'pressureStatus': 'normal',
                    'runtime': 156,
                    'runtimeHours': 3744
                },
                'parts': generate_default_parts(machine_type)
            }
            
            machines.append(machine_data)
        
        # Retornar no formato esperado
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'machines': machines
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
            'body': json.dumps({'error': str(e)})
        }

def detect_machine_type(name):
    """Detecta tipo de máquina pelo nome"""
    if 'bomba' in name or 'pump' in name:
        return 'centrifugal-pump'
    elif 'compressor' in name:
        return 'compressor'
    elif 'motor' in name:
        return 'electric-motor'
    elif 'valvula' in name or 'valve' in name:
        return 'valve'
    else:
        return 'generic-equipment'

def generate_default_parts(machine_type):
    """Gera peças padrão baseado no tipo"""
    if machine_type == 'centrifugal-pump':
        return [
            {
                'id': 'A',
                'label': 'A',
                'name': 'Caixa de Vedação',
                'partNumber': 'ZX92A4L',
                'manufacturer': 'Indústria Central',
                'status': 'good',
                'statusText': 'Bom Estado',
                'recommendation': 'Verificar parafusos de fixação mensalmente',
                'position': {'x': 400, 'y': 150},
                'color': '#10b981',
                'metrics': {
                    'temperature': 55,
                    'temperatureStatus': 'normal',
                    'vibration': 1.2,
                    'vibrationStatus': 'normal',
                    'wear': 15,
                    'wearStatus': 'normal'
                }
            },
            {
                'id': 'B',
                'label': 'B',
                'name': 'Rotor',
                'partNumber': 'RT-500X',
                'manufacturer': 'Indústria Central',
                'status': 'warning',
                'statusText': 'Atenção',
                'recommendation': 'Substituir nos próximos 30 dias',
                'position': {'x': 500, 'y': 200},
                'color': '#f59e0b',
                'metrics': {
                    'temperature': 72,
                    'temperatureStatus': 'warning',
                    'vibration': 3.5,
                    'vibrationStatus': 'warning',
                    'wear': 65,
                    'wearStatus': 'warning'
                }
            }
        ]
    else:
        return [
            {
                'id': 'A',
                'label': 'A',
                'name': 'Componente Principal',
                'partNumber': 'GEN-001',
                'manufacturer': 'Indústria Central',
                'status': 'good',
                'statusText': 'Bom Estado',
                'recommendation': 'Manutenção preventiva trimestral',
                'position': {'x': 400, 'y': 150},
                'color': '#10b981',
                'metrics': {
                    'temperature': 60,
                    'temperatureStatus': 'normal',
                    'vibration': 2.0,
                    'vibrationStatus': 'normal',
                    'wear': 20,
                    'wearStatus': 'normal'
                }
            }
        ]