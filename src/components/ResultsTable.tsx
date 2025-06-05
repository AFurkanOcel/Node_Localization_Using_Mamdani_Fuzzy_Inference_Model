import  React from 'react';

interface ResultsTableProps {
  results: {
    actual: number;
    predicted: number;
    error: number;
  }[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actual ALE
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Predicted ALE
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classification
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {results.map((row, index) => (
              <tr key={index} className={row.error < 0.1 ? 'bg-green-50' : undefined}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {row.actual.toFixed(3)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {row.predicted.toFixed(3)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    row.error < 0.1 ? 'bg-green-100 text-green-800' :
                    row.error < 0.3 ? 'bg-blue-100 text-blue-800' : 
                    row.error < 0.6 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {row.error.toFixed(3)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    row.predicted < 0.3 ? 'bg-green-100 text-green-800' : 
                    row.predicted < 0.6 ? 'bg-blue-100 text-blue-800' :
                    row.predicted < 0.9 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {row.predicted < 0.3 ? 'Excellent' : 
                     row.predicted < 0.6 ? 'Good' :
                     row.predicted < 0.9 ? 'Fair' : 'Poor'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
 