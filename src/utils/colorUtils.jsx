export function getColorForValue(type, value) {
    const colorMaps = {
      toolType: {
        CODESCAN: '#1890ff',
        DEPENDABOT: '#0099e6',
        SECRETSCAN: '#722ed1',
      },
      status: {
        OPEN: '#52c41a',
        CLOSED: '#52c41a',
        FIXED: '#52c41a',
        IGNORED: '#d46b08',
      },
      severity: {
        CRITICAL: '#820014',
        HIGH: '#cf1322',
        MEDIUM: '#fa8c16',
        LOW: '#faad14',
        NOTE: '#8c8c8c',
      },
    };
  
    const fallbackColor = '#595959';
    return colorMaps[type]?.[value] || fallbackColor;
  }
  