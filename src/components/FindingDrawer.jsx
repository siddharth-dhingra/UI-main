/* eslint-disable react/prop-types */
import { Drawer, Button, Typography, Descriptions, Tag } from 'antd';
import { getColorForValue } from '../utils/colorUtils';

const { Paragraph } = Typography;

function formatDate(dateTimeObject){
    if (dateTimeObject) {
        // Convert "2025-01-27T04:57:56" or "2025-01-27T04:57:56Z" into a Date object
        const dateObj = new Date(dateTimeObject);
        // Format using user's locale (e.g., "1/27/2025, 4:57:56 AM")
        return dateObj.toLocaleString();
    }
    return "N/A"
}

function FindingDrawer({
  visible,
  onClose,
  selectedFinding,
  descriptionExpanded,
  setDescriptionExpanded,
  suggestionExpanded,
  setSuggestionExpanded
}) {
  if (!selectedFinding) {
    return null;
  }

  const maxLength = 150;

  // DESCRIPTION FIELDS
  const fullDesc = selectedFinding.description || '';
  const truncatedDesc =
    fullDesc.length > maxLength ? fullDesc.slice(0, maxLength) + '...' : fullDesc;

  // Determine which description to display
  const finalDescription =
    !descriptionExpanded ? truncatedDesc : fullDesc;

  // HELP / SUGGESTION FIELDS
  const helpText = selectedFinding?.additionalData?.rule?.help || 'N/A';
  // Slice the help text if it's too long
  const truncatedHelp =
    helpText.length > maxLength ? helpText.slice(0, maxLength) + '...' : helpText;

  // Determine which help text to display
  const finalHelp = suggestionExpanded ? helpText : truncatedHelp;

  return (
    <Drawer
      title="Finding Details"
      placement="right"
      open={visible}
      width={700}
      onClose={onClose}
    >
      <Descriptions
        column={1}
        bordered
        size="middle"
        style={{ margin: '0 auto' }}
        labelStyle={{ fontWeight: 'bold', width: '120px' }}
      >
        {/* ID */}
        <Descriptions.Item label="ID">
          {selectedFinding.id}
        </Descriptions.Item>

        {/* TITLE */}
        <Descriptions.Item label="Title">
          {selectedFinding.title}
        </Descriptions.Item>

        {/* SEVERITY */}
        <Descriptions.Item label="Severity">
          <Tag
            style={{
              backgroundColor: `${getColorForValue('severity', selectedFinding.severity)}1A`,
              color: getColorForValue('severity', selectedFinding.severity),
              fontWeight: 'bold'
            }}
          >
            {selectedFinding.severity}
          </Tag>
        </Descriptions.Item>

        {/* STATUS */}
        <Descriptions.Item label="Status">
          <Tag
            style={{
              backgroundColor: `${getColorForValue('status', selectedFinding.status)}1A`,
              color: getColorForValue('status', selectedFinding.status),
              fontWeight: 'bold'
            }}
          >
            {selectedFinding.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
            {formatDate(selectedFinding.createdAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Updated At">
        {formatDate(selectedFinding.updatedAt)}
        </Descriptions.Item>

        {/* TOOL TYPE */}
        <Descriptions.Item label="Tool Type">
          <Tag
            style={{
              backgroundColor: `${getColorForValue('toolType', selectedFinding.toolType)}1A`,
              color: getColorForValue('toolType', selectedFinding.toolType),
              fontWeight: 'bold'
            }}
          >
            {selectedFinding.toolType}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
            {finalDescription}
          </Paragraph>

          {fullDesc.length > maxLength && (
            <Button
              type="link"
              onClick={() => setDescriptionExpanded(prevState => !prevState)}
            >
              {descriptionExpanded ? 'View Less' : 'View More'}
            </Button>
          )}
        </Descriptions.Item>

        {/* DESCRIPTION */}
        {/* <Descriptions.Item label="Description">
          <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
            {finalDescription}
          </Paragraph>

          {isDependabot && fullDesc.length > maxLength && !descriptionExpanded && (
            <Button type="link" onClick={() => setDescriptionExpanded(true)}>
              View More
            </Button>
          )}
        </Descriptions.Item> */}

        {/* LOCATION */}
        <Descriptions.Item label="Location">
          {selectedFinding.location || 'N/A'}
        </Descriptions.Item>

        {/* URL */}
        <Descriptions.Item label="URL">
          {selectedFinding.url ? (
            <a href={selectedFinding.url} target="_blank" rel="noreferrer">
              {selectedFinding.url}
            </a>
          ) : (
            'N/A'
          )}
        </Descriptions.Item>

        {/* CWE */}
        <Descriptions.Item label="CWE">
          {selectedFinding.cwe || 'N/A'}
        </Descriptions.Item>

        {/* CVE */}
        <Descriptions.Item label="CVE">
          {selectedFinding.cve || 'N/A'}
        </Descriptions.Item>

        {/* CVSS */}
        <Descriptions.Item label="CVSS">
          {selectedFinding.cvss || 'N/A'}
        </Descriptions.Item>

        {/* SUGGESTIONS (HELP TEXT) */}
        <Descriptions.Item label="Suggestions">
          <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
            {finalHelp}
          </Paragraph>

          {helpText.length > maxLength && (
            <Button
              type="link"
              onClick={() => setSuggestionExpanded(prevState => !prevState)}
            >
              {suggestionExpanded ? 'View Less' : 'View More'}
            </Button>
          )}
        </Descriptions.Item>

        {/* If you want to see all data
        <Descriptions.Item label="All Data">
          <pre style={{ background: '#f5f5f5', padding: 8 }}>
            {JSON.stringify(selectedFinding, null, 2)}
          </pre>
        </Descriptions.Item>
        */}
      </Descriptions>
    </Drawer>
  );
}

export default FindingDrawer;
