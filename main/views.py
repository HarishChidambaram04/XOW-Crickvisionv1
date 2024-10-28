from django.shortcuts import render, redirect
from django.contrib import auth
import pyrebase
from django.contrib.auth import logout
import requests
import numpy as np
from django.shortcuts import render
from django.contrib import auth
import os
from dotenv import load_dotenv
from .oop import currentUser, developer
load_dotenv()


config = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "databaseURL": os.getenv("FIREBASE_DATABASE_URL"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
}
global curr_user

curr_user = None


firebase = pyrebase.initialize_app(config)
database = firebase.database()
authe = firebase.auth()
global local_id
global namex
global credit
global vcount

def showWelcomePage(request):
    print(request)
    return render(request, "index.html")

def showSignin(request):
    return render(request, "auth.html",{"page":"signin"})

def showSignup(request):
    return render(request, "auth.html",{"page":"signup"})

def showForgotPass(request):
    return render(request, "auth.html",{"page":"forgotpass"})

def showcontact(request):
    return render(request, "contact.html")
#TEST


def validateForgotPass(request):
    if request.method == "POST":
        email = request.POST.get('emailf')
        sendem = authe.send_password_reset_email(email)
        print(sendem)
        message = "An password reset email has been sent to " + sendem.get('email') +", follow the steps there."
        return render(request,"auth.html",{"page":"signin","msg":message})
    
def signInValidate(request):
    global local_id
    global idtoken
    global credit
    global vcount
    global namex
    global curr_user
    if request.method == "POST":
        email = request.POST.get("emailx")
        password = request.POST.get("passx")
        try:
            user = authe.sign_in_with_email_and_password(email, password)
            if user is not None and "idToken" in user:
                idtoken = user["idToken"]
                user_info = authe.get_account_info(idtoken)
                email_verified = user_info['users'][0]['emailVerified']
                if email_verified:
                    fbdata = config
                    logged = True
                    userid = user_info["users"][0]["localId"]
                    name = database.child("users").child(userid).child("details").child("name").get().val()
                    uType = database.child("users").child(userid).child("details").child("type").get().val()
                    if uType == "A":
                        curr_user = developer(name,userid)
                        curr_user.getAllUsers()
                        names = curr_user.getNamelist()
                        emails = curr_user.getEmaillist()
                        user_ids = curr_user.getIdlist()
                        requests = curr_user.getRequestlist()
                        uUrls = curr_user.getuUrlslist()
                        size = len(user_ids)
                        print(size)
                        zipped_lists = zip(names,emails,user_ids,requests,uUrls)
                        return render(request,"admin.html", {"namex":name, "fbdata": fbdata,"zipped_lists":zipped_lists})

                    else:
                        videocount = int(database.child("users").child(userid).child("details").child("videos").get().val())
                        curr_user = currentUser(name,userid,videocount)
                        block = curr_user.getBlock()
                        rprt = database.child("users").child(userid).child("details").child("report").get().val()
                        if rprt != None:
                            if rprt != "0":
                                rprtv = curr_user.fetchReportsV(database)
                                rprti1 = curr_user.fetchReportsI1(database)
                                rprti2 = curr_user.fetchReportsI2(database)
                                rprti3 = curr_user.fetchReportsI3(database)

                                return render(request,"welcome.html", {"name":name, "fbdata": fbdata, "userid": userid,"vcount":videocount,"rv":rprtv,"ri1":rprti1,"ri2":rprti2,"ri3":rprti3,"block": block,"report":"True"})


                        return render(request,"welcome.html", {"name":name, "fbdata": fbdata, "userid": userid,"vcount":videocount, "block": block,"report":"True"})
                else:
                    message = "Email is not verified, kindly verify your Email before signing in!"
                    return render(request, "auth.html",{"page":"signin","msg":message})
            else:
                message = "User not found"
                return render(request, "auth.html", {"page":"signin","msg": message})
        except Exception as e:
            
            msg = str(e)
            if "INVALID_LOGIN_CREDENTIALS" in msg:
                message = "Invalid Login Credentials, Forgot your password?"
                return render(request, "auth.html", {"page":"signin","msg": message})
            elif "TOO_MANY_ATTEMPTS_TRY_LATER" in msg:
                message = "Too many Attempts, Try again later!"
                return render(request, "auth.html", {"page":"signin","msg": message})
            else:
                message = "Internal Error!, Try Later"
                return render(request, "auth.html", {"page":"signin","msg": message})
    return render(request, "auth.html",{"page":"signin"})
    
def signUpValidate(request):
    global local_id
    name = request.POST.get("name")
    email = request.POST.get("email")
    passw = request.POST.get("pass")
    try:
        user = authe.create_user_with_email_and_password(email, passw)
        authe.send_email_verification(user["idToken"])
        uid = user["localId"]
        local_id = uid
        data = {
        "name": name,
        "status": "1",
        "email": email,
        "videos": 0,
        "credit": 1,
        "type": "U",
        "request": "0",
        }
        msg = "An verification Email has been sent to your email, Verify your email and proceed to login"
        database.child("users").child(uid).child("details").set(data)
        return render(request, "auth.html",{"msg":msg,"page":"signin"})
    except Exception as e:
        msg = "Unable to create account. Try again"
        return render(request, "auth.html", {"msg":msg,"page":"signin"})
    
def logoutProcess(request):
    apl = auth.logout(request)
    print(apl)
    return render(request,"auth.html",{"page":"signin","msg":"Thank you, Visit again!"})

def uploadVideo(request):
    global idtoken
    if request.method == "POST":
        something = request.POST.get("videoFile")
        print(something)
    return render(request,"welcome.html")

# def videoProcess(request):

#     global vcount
#     if request.method == "POST":
#         vidUrl = request.POST.get("vidUrl")
#         local_id = request.POST.get("us_id")
#         fname = request.POST.get("fname")
#         uName = request.POST.get("uName")
#         curr_user.videoProcess(database,vidUrl,fname)
#         curr_user.changeVcount(database)
#         curr_user.submitRequest(database)
#         curr_user.sendRequestMail(uName)
        
#         bTr = curr_user.getBlock()

        
#         return render(request,"welcome.html", {"name":curr_user.name,"videocount":curr_user.videocount, "ss": "show","block":bTr})



def videoProcess(request):
    global vcount
    
    if request.method == "POST":


        vidUrl = request.POST.get("vidUrl")
        local_id = request.POST.get("us_id")
        fname = request.POST.get("fname")
        uName = request.POST.get("uName")
        

        curr_user.videoProcess(database, vidUrl, fname)
        curr_user.changeVcount(database)
        curr_user.submitRequest(database)
        curr_user.sendRequestMail(uName)
        
        bTr = curr_user.getBlock()


        return render(request, "welcome.html", {
            "name": curr_user.name,
            "videocount": curr_user.videocount,
            "ss": "show",
            "block": bTr
        })
    
    return render ({"error": "Invalid request method"}, status=400)
def reportSubmit(request):
    if request.method == "POST":
        try:
            vidURL = request.POST.get("videou")
            userID = request.POST.get("userid")
            images1 = request.POST.get("images1")
            images2 = request.POST.get("images2")
            images3 = request.POST.get("images3")
            i1list = images1.split(',')
            i2list = images2.split(',')
            i3list = images3.split(',')
            rName = request.POST.get("rName")
            rMail = request.POST.get("rMail")
            name = request.POST.get("devname")

            print(f"Video URL: {vidURL}, UserID: {userID}")
            print(f"Images: {i1list}, {i2list}, {i3list}")
            print(f"Name: {name}, Email: {rMail}, Report Name: {rName}")

            database.child("users").child(userID).child("details").child("report").child("videos").set(vidURL)
            database.child("users").child(userID).child("details").child("report").child("images").child('cat1').set(i1list)
            database.child("users").child(userID).child("details").child("report").child("images").child('cat2').set(i2list)
            database.child("users").child(userID).child("details").child("report").child("images").child('cat3').set(i3list)

            database.child("users").child(userID).child("details").child("request").set("0")

            # Send email
            try:
                curr_user.send_email(rMail, rName)
            except Exception as e:
                print(f"Error sending email: {e}")
                return render(request, "admin.html", {"namex": name, "notif": "Email sending failed!"})

            curr_user.getAllUsers()
            names = curr_user.getNamelist()
            emails = curr_user.getEmaillist()
            user_ids = curr_user.getIdlist()
            requests = curr_user.getRequestlist()
            uUrls = curr_user.getuUrlslist()

            size = len(user_ids)
            print(f"Number of users: {size}")

            zipped_lists = zip(names, emails, user_ids, requests, uUrls)
            return render(request, "welcome.html", {"namex": name, "zipped_lists": zipped_lists, "notif": f"Mail Sent to {rMail}"})

        except Exception as e:
            print(f"Error in reportSubmit: {e}")
            return render(request, "welcome.html", {"namex": "", "notif": "Report submission failed!"})
