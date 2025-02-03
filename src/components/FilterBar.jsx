/* eslint-disable react/prop-types */
import { Row, Col, Select, Button, Typography } from 'antd';

const { Text } = Typography;

function FilterBar({
  toolTypes,
  severities,
  statuses,
  selectedToolTypes,
  selectedSeverities,
  selectedStatuses,
  onToolTypesChange,
  onSeveritiesChange,
  onStatusesChange,
  onApplyFilter
}) {
  return (
    <Row justify="center" gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col>
        <Text>Tool Type: </Text>
        <Select
          mode="multiple"
          style={{ width: 200 }}
          placeholder="Select ToolType(s)"
          allowClear
          value={selectedToolTypes}
          onChange={onToolTypesChange}
        >
          {toolTypes.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col>
        <Text>Severity: </Text>
        <Select
          mode="multiple"
          style={{ width: 200 }}
          placeholder="Select Severity(ies)"
          allowClear
          value={selectedSeverities}
          onChange={onSeveritiesChange}
        >
          {severities.map((sev) => (
            <Select.Option key={sev} value={sev}>
              {sev}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col>
        <Text>State: </Text>
        <Select
          mode="multiple"
          style={{ width: 200 }}
          placeholder="Select State(s)"
          allowClear
          value={selectedStatuses}
          onChange={onStatusesChange}
        >
          {statuses.map((stat) => (
            <Select.Option key={stat} value={stat}>
              {stat}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col>
        <Button type="primary" onClick={onApplyFilter}>
          Apply Filter
        </Button>
      </Col>
    </Row>
  );
}

export default FilterBar;
