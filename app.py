from flask import Flask, render_template, request, redirect, session, url_for, send_from_directory
import os
# import pyrebase

# firebaseConfig = {
#     'apiKey': "AIzaSyADJUChmUPrfZT6wwYtSdrc8ANWhbIZoQU",
#     'authDomain': "xlent-academy.firebaseapp.com",
#     'databaseURL': "https://xlent-academy-default-rtdb.firebaseio.com",
#     'projectId': "xlent-academy",
#     'storageBucket': "xlent-academy.appspot.com",
#     'messagingSenderId': "851179064801",
#     'appId': "1:851179064801:web:85582aa07b2ed89ce5d6a0",
#     'measurementId': "G-T5T13PRT76"
# }
# firebase = pyrebase.initialize_app(firebaseConfig)
# db = firebase.database()

app = Flask(__name__)
app.secret_key = "###XlentAcademyEBMtemNEMhem###"


@app.route('/', methods=['GET', 'POST'])
def home():
    # if 'user' in session:
    #     return redirect(url_for("manageFiles"))
    return render_template('login.html')


database = {'staff': 'xlent'}


@app.route('/login', methods=['GET', 'POST'])
def login():
    # if 'user' in session:
    #     return redirect(url_for("manageFiles"))
    if request.method == 'POST':
        try:
            username = request.form['username']
            password = request.form['password']
        except Exception:
            return redirect('/')

        if username in database:
            if database[username] == password:
                session["user"] = username
                return redirect(url_for('manageFiles'))
            else:
                warnMessage = "Wrong Password!"
                return render_template('login.html', warnMessagepwd=warnMessage)
        else:
            warnMessage = "Invalid Username!"
            return render_template('login.html', warnMessageusr=warnMessage)
    else:
        return redirect('/')


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    if "user" in session:
        session.pop("user", None)
    return redirect('/')


@app.route('/manageFiles', methods=['GET', 'POST'])
def manageFiles():
    if "user" in session:
        # STD = db.child("myDocs").get()
        # models = list(STD.val())
        # values = list()
        # for std in models:
        #     STD = db.child("myDocs").child(str(std)).get()
        #     values.append(STD.val())
        # print()
        # print(list(STD.val()))
        # print()
        # models = list()
        # for i in range(5, 13):
        #     models.append(str(i))
        # return render_template('manageFile.html', model=enumerate(models))
        return render_template('manageFile.html')
    else:
        return redirect('/')


@app.route('/nu', methods=['GET', 'POST'])
def getData():
    if 'user' in session:
        if request.method == "POST":
            try:
                logback = request.form["logback"]
                if logback == "upload":
                    return redirect(url_for("uploadFiles"))
                elif logback == "yes":
                    session.pop("filename", None)
                    session.pop("fileurl", None)
                    session.pop("std", None)
                    session.pop("sub", None)
                    session.pop("key", None)
                    return redirect(url_for("manageFiles"))
                else:
                    filename = request.form["name"]
                    fileurl = request.form["url"]
                    std = request.form["std"]
                    sub = request.form["sub"]
                    key = request.form["key"]
                    session["filename"] = filename
                    session["fileurl"] = fileurl
                    session["std"] = std
                    session["sub"] = sub
                    session["key"] = key
                    return redirect(url_for("updateFiles"))
            except Exception:
                filename = request.form["name"]
                fileurl = request.form["url"]
                std = request.form["std"]
                sub = request.form["sub"]
                key = request.form["key"]
                session["filename"] = filename
                session["fileurl"] = fileurl
                session["std"] = std
                session["sub"] = sub
                session["key"] = key
                # print()
                # print(filename)
                # print()
                # print(fileurl)
                # print()
                return redirect(url_for("updateFiles"))
    else:
        return redirect("/")


@app.route('/updateFiles')
def updateFiles():
    if 'user' in session:
        if 'filename' in session and 'fileurl' in session:
            filename = session["filename"]
            fileurl = session["fileurl"]
            std = session["std"]
            sub = session["sub"]
            key = session["key"]
            subList = ['Mathematics', 'Chemistry',
                       'Physics', 'History', 'Geography', 'Civics']
            return render_template("updateFile.html", filename=filename, fileurl=fileurl, std=int(std), sub=sub, key=key, subList=subList)
        else:
            return redirect("/")
    else:
        return redirect("/")


@app.route('/uploadFiles')
def uploadFiles():
    if 'user' in session:
        return render_template("uploadFile.html")
    else:
        return redirect("/")


@app.errorhandler(404)
def page_not_found(e):
    return redirect('/')


@app.route('/robots.txt')
@app.route('/sitemap.xml')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))
    app.run(host="127.0.1.0", debug=False, port=port)
