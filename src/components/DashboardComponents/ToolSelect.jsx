/* eslint-disable react/prop-types */
import { Row, Col, Select } from 'antd';

const { Option } = Select;

function ToolSelect({ selectedTool, onChange, toolTypes }) {
  return (
    <Row style={{ marginBottom: 16 }}>
      <Col>
        {/* <span style={{ marginRight: 8 }}>Select Tool:</span> */}
        <Select value={selectedTool} onChange={onChange} style={{ width: 200, marginTop:"13px" }}>
          <Option value="ALL">ALL</Option>
          {toolTypes.map(tool => (
            <Option key={tool} value={tool}>{tool}</Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
}

export default ToolSelect;
