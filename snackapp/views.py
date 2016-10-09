from django.shortcuts import render

# Create your views here.
def item_list(request):
    return render(request, 'snackapp/item_list.html', {})

def item_chart(request):
    return render(request, 'snackapp/item_chart.html', {})

def elements(request):
    return render(request, 'snackapp/elements.html', {})
