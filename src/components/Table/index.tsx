type Props = {
  headers: string[];
  data: string[][] | null;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export function Table({ headers, data }: Props) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers?.map((header, index) => <th key={index}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
