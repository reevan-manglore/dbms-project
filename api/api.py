from flask import Flask,request;
from flask_restful import Api,Resource;
from flask_cors import CORS;
import mysql.connector;

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",
    database='project'
);

app = Flask(__name__);

CORS(app);

api = Api(app);


class Symptoms(Resource):
    def get(self):
        disease = request.args.get("symptoms");
        disease = disease.strip("[]").split(",");
        disease = ",".join(map(str,disease));
        print("disease are {}".format(disease));
        cursor = db.cursor();
        query = """
            select dName,count(*) as frequency from
            disease d,diseaseSymptoms ds,symptoms s
            where d.dId = ds.dId
            and ds.sId = s.sId
            and sName in (%s)
            group by dName
            order by frequency desc;
        """
        cursor.execute(query%(disease));
        record = cursor.fetchall();
        cursor.close();
        return record;


api.add_resource(Symptoms,"/symptoms");

if __name__ =="__main__":
    app.run(debug=True);
