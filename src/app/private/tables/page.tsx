"use server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as XLSX from "xlsx";

type Division = "Division2" | "Division3";
const tableSources = {
  Division2: "https://lms.playchess.org.uk/event/34/table/xl",
  Division3: "https://lms.playchess.org.uk/event/35/table/xl",
};

type Data = { [key: string]: string };

const getTableData = async (division: Division): Promise<Data[]> => {
  const doc = await fetch(tableSources[division]).then((response) =>
    response.arrayBuffer(),
  );
  const workbook = XLSX.read(doc);
  const data = XLSX.utils.sheet_to_json(workbook.Sheets.excel).sort((a, b) =>
    // @ts-ignore
    parseInt(a.Points, 10) > parseInt(b.Points, 10) ||
    // @ts-ignore
    (parseInt(a.Points, 10) == parseInt(b.Points, 10) &&
      // @ts-ignore
      parseInt(a.Play, 10) < parseInt(b.Play, 10))
      ? -1
      : 1,
  ) as Data[];
  return data;
};

function LeagueTable({
  title,
  header,
  data,
}: {
  title: string;
  header: string[];
  data: Data[];
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {["#", ...header].slice(0, -3).map((label, index) => (
                  <TableHead key={index}>{label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  className={row.Team.startsWith("Sandy") ? "bg-amber-100" : ""}
                >
                  {[(index + 1).toString(), ...Object.values(row)]
                    .slice(0, -3)
                    .map((cell, index) => (
                      <TableCell className="font-medium" key={index}>
                        <div className="py-[10]">{cell}</div>
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const Page = async () => {
  const tableData1 = await getTableData("Division2");
  const tableData2 = await getTableData("Division3");
  return (
    <section>
      <LeagueTable
        title="Edinburgh League Division 2"
        header={Object.keys(tableData1[0]!)}
        data={tableData1}
      />
      <LeagueTable
        title="Edinburgh League Division 3"
        header={Object.keys(tableData2[0]!)}
        data={tableData2}
      />
    </section>
  );
};

export default Page;
